import React, { useState, useMemo } from 'react';
import { TollPlaza, Operator } from '../types/toll';
import { OPERATORS } from '../data/tollNetwork';
import { PaymentBadge } from './PaymentBadge';
import { isFlatRateLine } from '../utils/fareEngine';
import {
  Compass,
  X,
  Search,
  Navigation,
  MapPin,
  ExternalLink,
  Layers,
  FileText,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface LineExplorerProps {
  plazas: TollPlaza[];
  originPlaza: TollPlaza | null;
  destinationPlaza: TollPlaza | null;
  onSelectOrigin: (plaza: TollPlaza) => void;
  onSelectDestination: (plaza: TollPlaza) => void;
  onClose: () => void;
}

interface TollLineGroup {
  lineName: string;
  operator: Operator;
  isFlatRate: boolean;
  plazas: TollPlaza[];
}

export const LineExplorer: React.FC<LineExplorerProps> = ({
  plazas,
  originPlaza,
  destinationPlaza,
  onSelectOrigin,
  onSelectDestination,
  onClose,
}) => {
  const [selectedOperator, setSelectedOperator] = useState<Operator | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  // Group plazas by expressway_line
  const lineGroups = useMemo<TollLineGroup[]>(() => {
    const map = new Map<string, { operator: Operator; plazas: TollPlaza[] }>();

    for (const plaza of plazas) {
      const key = plaza.expressway_line.trim();
      if (!map.has(key)) {
        map.set(key, { operator: plaza.operator, plazas: [] });
      }
      map.get(key)!.plazas.push(plaza);
    }

    const groups: TollLineGroup[] = [];
    map.forEach((data, lineName) => {
      groups.push({
        lineName,
        operator: data.operator,
        isFlatRate: isFlatRateLine(lineName),
        plazas: data.plazas,
      });
    });

    return groups;
  }, [plazas]);

  // Filter line groups based on operator and search query
  const filteredLineGroups = useMemo(() => {
    return lineGroups.filter((group) => {
      // Filter by Operator
      if (selectedOperator !== 'ALL' && group.operator !== selectedOperator) {
        return false;
      }

      // Filter by search query
      if (!searchTerm.trim()) return true;
      const lower = searchTerm.toLowerCase().trim();

      const matchesLine = group.lineName.toLowerCase().includes(lower);
      const matchesPlaza = group.plazas.some(
        (p) =>
          p.name_th.toLowerCase().includes(lower) ||
          p.name_en.toLowerCase().includes(lower) ||
          p.operator.toLowerCase().includes(lower)
      );

      return matchesLine || matchesPlaza;
    });
  }, [lineGroups, selectedOperator, searchTerm]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col overflow-hidden animate-fade-in">
      {/* Modal Top Navigation Bar */}
      <div className="glass-panel border-b border-slate-800 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <span>สำรวจสายทางด่วนและมอเตอร์เวย์ (Expressway Line Explorer)</span>
            </h2>
            <p className="text-xs text-slate-400 font-light">
              ค้นหารายชื่อด่านทางด่วน แยกตามผู้ให้บริการและสายทาง พร้อมดูช่องทางชำระเงินที่รองรับ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Count Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>
              {filteredLineGroups.length} สายทาง ({plazas.length} ด่าน)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel px-6 py-3 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Operator Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedOperator('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedOperator === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            ทั้งหมด (All)
          </button>

          {(Object.keys(OPERATORS) as Operator[]).map((opKey) => {
            const op = OPERATORS[opKey];
            const isSelected = selectedOperator === opKey;
            return (
              <button
                key={opKey}
                onClick={() => setSelectedOperator(opKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
                style={isSelected ? { backgroundColor: op.color } : {}}
              >
                <span>{op.short_name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อสายทาง หรือ ด่าน..."
            className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Line Cards List View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
        {filteredLineGroups.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3 border border-slate-800 max-w-md mx-auto">
            <Compass className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-bold text-slate-300 text-base">ไม่พบข้อมูลสายทางด่วน</h3>
            <p className="text-xs text-slate-400">
              ลองเปลี่ยนคำค้นหา หรือเลือกแท็บผู้ให้บริการอื่น
            </p>
          </div>
        ) : (
          filteredLineGroups.map((group) => {
            const op = OPERATORS[group.operator];
            const isExpanded = selectedLine === null || selectedLine === group.lineName;

            return (
              <div
                key={group.lineName}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition space-y-4 p-5"
              >
                {/* Line Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-md text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: op.color }}
                      >
                        {group.operator}
                      </span>
                      <h3 className="font-bold text-base text-white">{group.lineName}</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-light">{op.name_th}</p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Rate System Tag */}
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                        group.isFlatRate
                          ? 'bg-teal-950/60 text-teal-300 border-teal-500/30'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {group.isFlatRate ? 'อัตราเหมาจ่าย (Flat-rate)' : 'คิดตามระยะทาง (Closed System)'}
                    </span>

                    {/* Official Document Link */}
                    {op.official_source_url && (
                      <a
                        href={op.official_source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-blue-400 hover:text-blue-300 border border-slate-700 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>ประกาศอัตราค่าผ่านทาง</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Plazas List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.plazas.map((plaza) => {
                    const isOrigin = originPlaza?.id === plaza.id;
                    const isDestination = destinationPlaza?.id === plaza.id;

                    return (
                      <div
                        key={plaza.id}
                        className={`glass-card p-3.5 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                          isOrigin
                            ? 'border-emerald-500/60 bg-emerald-950/20'
                            : isDestination
                            ? 'border-rose-500/60 bg-rose-950/20'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-bold text-sm text-white">{plaza.name_th}</h4>
                            <div className="flex items-center gap-1">
                              {plaza.is_entry && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-[10px] font-bold">
                                  ขึ้น
                                </span>
                              )}
                              {plaza.is_exit && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-700/50 text-[10px] font-bold">
                                  ลง
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 mb-2 font-light">{plaza.name_en}</p>

                          <div className="text-[11px] font-mono text-emerald-400/90 mb-2">
                            GPS: [{plaza.coords[0].toFixed(4)}, {plaza.coords[1].toFixed(4)}]
                          </div>

                          {/* Payment Method Badges */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {plaza.payment_methods.map((pm) => (
                              <PaymentBadge key={pm} method={pm} size="sm" />
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                          <button
                            onClick={() => {
                              onSelectOrigin(plaza);
                              onClose();
                            }}
                            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isOrigin
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/40'
                            }`}
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>{isOrigin ? 'จุดขึ้น (เลือกแล้ว)' : 'ตั้งเป็นจุดขึ้น'}</span>
                          </button>

                          <button
                            onClick={() => {
                              onSelectDestination(plaza);
                              onClose();
                            }}
                            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isDestination
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-700/40'
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{isDestination ? 'จุดลง (เลือกแล้ว)' : 'ตั้งเป็นจุดลง'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info Banner */}
      <div className="glass-panel border-t border-slate-800 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>ข้อมูลอัตราค่าผ่านทางอัปเดตตามประกาศทางการ กทพ. / BEM / DMT / กรมทางหลวง 2026</span>
        </div>
        <button onClick={onClose} className="text-slate-300 hover:text-white font-medium underline">
          ปิดหน้าต่าง (Close)
        </button>
      </div>
    </div>
  );
};
