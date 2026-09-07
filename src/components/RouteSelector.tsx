import React, { useState, useRef, useEffect } from 'react';
import { TollPlaza } from '../types/toll';
import { OPERATORS } from '../data/tollNetwork';
import { getValidDestinationsForOrigin, isFlatRateLine } from '../utils/fareEngine';
import { Navigation, MapPin, ArrowUpDown, X, Check, Lock, Sparkles } from 'lucide-react';

interface RouteSelectorProps {
  plazas: TollPlaza[];
  originPlaza: TollPlaza | null;
  destinationPlaza: TollPlaza | null;
  onSelectOrigin: (plaza: TollPlaza | null) => void;
  onSelectDestination: (plaza: TollPlaza | null) => void;
  onSwap: () => void;
}

export const RouteSelector: React.FC<RouteSelectorProps> = ({
  plazas,
  originPlaza,
  destinationPlaza,
  onSelectOrigin,
  onSelectDestination,
  onSwap,
}) => {
  const [originSearch, setOriginSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setIsOriginOpen(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(e.target as Node)) {
        setIsDestinationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterOriginPlazas = (search: string) => {
    if (!search.trim()) return plazas;
    const lower = search.toLowerCase().trim();
    return plazas.filter(
      (p) =>
        p.name_th.toLowerCase().includes(lower) ||
        p.name_en.toLowerCase().includes(lower) ||
        p.expressway_line.toLowerCase().includes(lower) ||
        p.operator.toLowerCase().includes(lower)
    );
  };

  const filterDestinationPlazas = (search: string) => {
    const validList = getValidDestinationsForOrigin(originPlaza, plazas);
    if (!search.trim()) return validList;
    const lower = search.toLowerCase().trim();
    return validList.filter(
      (p) =>
        p.name_th.toLowerCase().includes(lower) ||
        p.name_en.toLowerCase().includes(lower) ||
        p.expressway_line.toLowerCase().includes(lower) ||
        p.operator.toLowerCase().includes(lower)
    );
  };

  const originFiltered = filterOriginPlazas(originSearch);
  const destinationFiltered = filterDestinationPlazas(destinationSearch);

  const isOriginFlatRate = originPlaza ? isFlatRateLine(originPlaza.expressway_line) : false;

  return (
    <div className="relative z-30 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base text-white flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-400" />
          <span>เลือกด่านจุดขึ้น-จุดลง ทางด่วน (Toll Booth Picker)</span>
        </h2>
        {(originPlaza || destinationPlaza) && (
          <button
            onClick={() => {
              onSelectOrigin(null);
              onSelectDestination(null);
              setOriginSearch('');
              setDestinationSearch('');
            }}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            ล้างข้อมูล
          </button>
        )}
      </div>

      {/* Same-Line or Flat-Rate Rule Notice */}
      {originPlaza && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border animate-fade-in ${
            isOriginFlatRate
              ? 'bg-teal-950/60 border-teal-500/40 text-teal-300'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
          }`}
        >
          {isOriginFlatRate ? (
            <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0" />
          ) : (
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
          )}
          <span>
            {isOriginFlatRate ? (
              <>
                ระบบอัตราแบนราบ/รายด่าน (Flat-rate): ชำระคงที่ตามอัตราประจำด่านในเครือ{' '}
                <strong className="text-white">{originPlaza.operator}</strong>
              </>
            ) : (
              <>
                ล็อกเลือกจุดลงเฉพาะในสายทางเดียวกัน (Same Line Only):{' '}
                <strong className="text-white font-bold">{originPlaza.expressway_line}</strong>
              </>
            )}
          </span>
        </div>
      )}

      <div className="relative flex flex-col md:flex-row items-stretch gap-3">
        {/* Origin Autocomplete Field */}
        <div ref={originRef} className="relative z-40 flex-1">
          <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>1. เลือกจุดขึ้นทางด่วน (Entrance Plaza)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Navigation className="w-4 h-4 text-emerald-400" />
            </div>
            <input
              type="text"
              value={originPlaza ? `${originPlaza.name_th} (${originPlaza.operator})` : originSearch}
              onChange={(e) => {
                setOriginSearch(e.target.value);
                if (originPlaza) {
                  onSelectOrigin(null);
                  onSelectDestination(null);
                }
                setIsOriginOpen(true);
              }}
              onFocus={() => setIsOriginOpen(true)}
              placeholder="ค้นหาหรือเลือกด่านจุดขึ้น..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
            />
            {(originPlaza || originSearch) && (
              <button
                onClick={() => {
                  onSelectOrigin(null);
                  onSelectDestination(null);
                  setOriginSearch('');
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Origin Autocomplete Dropdown List with high z-index */}
          {isOriginOpen && (
            <div className="absolute z-[100] left-0 right-0 mt-1 max-h-64 overflow-y-auto custom-scrollbar bg-slate-900 border border-slate-700 rounded-xl shadow-2xl divide-y divide-slate-800 ring-1 ring-black/5">
              {originFiltered.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">ไม่พบชื่อด่าน...</div>
              ) : (
                originFiltered.map((plaza) => {
                  const op = OPERATORS[plaza.operator];
                  const isSelected = originPlaza?.id === plaza.id;
                  return (
                    <button
                      key={plaza.id}
                      onClick={() => {
                        onSelectOrigin(plaza);
                        setIsOriginOpen(false);
                        onSelectDestination(null);
                      }}
                      className={`w-full text-left p-2.5 text-xs flex items-center justify-between hover:bg-slate-800/90 transition ${
                        isSelected ? 'bg-emerald-950/40 text-emerald-300' : 'text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                          <span>{plaza.name_th}</span>
                          <span
                            className="px-1.5 py-0.2 rounded text-[10px] text-white font-bold"
                            style={{ backgroundColor: op.color }}
                          >
                            {plaza.operator}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-light">
                          {plaza.expressway_line}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center self-center py-1 z-30">
          <button
            onClick={onSwap}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 shadow-md transition-transform active:scale-95"
            title="สลับจุดขึ้น - จุดลง"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Autocomplete Field */}
        <div ref={destinationRef} className="relative z-40 flex-1">
          <label className="block text-xs font-semibold text-rose-400 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>
              2. เลือกจุดลงทางด่วน (Exit Plaza){' '}
              {originPlaza && (
                <span className="text-amber-400 font-bold">
                  ({isOriginFlatRate ? `${originPlaza.operator} System` : 'Same Line Only'})
                </span>
              )}
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-rose-400" />
            </div>
            <input
              type="text"
              value={
                destinationPlaza
                  ? `${destinationPlaza.name_th} (${destinationPlaza.operator})`
                  : destinationSearch
              }
              onChange={(e) => {
                setDestinationSearch(e.target.value);
                if (destinationPlaza) onSelectDestination(null);
                setIsDestinationOpen(true);
              }}
              onFocus={() => setIsDestinationOpen(true)}
              placeholder={
                originPlaza
                  ? isOriginFlatRate
                    ? `เลือกจุดลงในระบบ ${originPlaza.operator}...`
                    : `เลือกจุดลงในสาย ${originPlaza.expressway_line}...`
                  : 'เลือกจุดขึ้นก่อนเพื่อล็อกสายทาง...'
              }
              className="w-full pl-9 pr-8 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-rose-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition"
            />
            {(destinationPlaza || destinationSearch) && (
              <button
                onClick={() => {
                  onSelectDestination(null);
                  setDestinationSearch('');
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Destination Autocomplete Dropdown List with high z-index */}
          {isDestinationOpen && (
            <div className="absolute z-[100] left-0 right-0 mt-1 max-h-64 overflow-y-auto custom-scrollbar bg-slate-900 border border-slate-700 rounded-xl shadow-2xl divide-y divide-slate-800 ring-1 ring-black/5">
              {destinationFiltered.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">
                  ไม่พบจุดลงในสายทางนี้...
                </div>
              ) : (
                destinationFiltered.map((plaza) => {
                  const op = OPERATORS[plaza.operator];
                  const isSelected = destinationPlaza?.id === plaza.id;
                  return (
                    <button
                      key={plaza.id}
                      onClick={() => {
                        onSelectDestination(plaza);
                        setIsDestinationOpen(false);
                      }}
                      className={`w-full text-left p-2.5 text-xs flex items-center justify-between hover:bg-slate-800/90 transition ${
                        isSelected ? 'bg-rose-950/40 text-rose-300' : 'text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                          <span>{plaza.name_th}</span>
                          <span
                            className="px-1.5 py-0.2 rounded text-[10px] text-white font-bold"
                            style={{ backgroundColor: op.color }}
                          >
                            {plaza.operator}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-light">
                          {plaza.expressway_line}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
