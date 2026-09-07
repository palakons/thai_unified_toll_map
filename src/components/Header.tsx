import React from 'react';
import { VehicleClass, Operator } from '../types/toll';
import { OPERATORS } from '../data/tollNetwork';
import { Car, Truck, Navigation, RefreshCw, Map, EyeOff, Settings } from 'lucide-react';

interface HeaderProps {
  vehicleClass: VehicleClass;
  onVehicleClassChange: (vc: VehicleClass) => void;
  onReset: () => void;
  selectedCount: number;
  showMap: boolean;
  onToggleMap: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  vehicleClass,
  onVehicleClassChange,
  onReset,
  selectedCount,
  showMap,
  onToggleMap,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/20">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white leading-tight">
                  ทางด่วนไทย <span className="text-blue-400">TollMap</span>
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Same-Operator Toll
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light">
                ระบบคำนวณค่าทางด่วนแยกตามบริษัทผู้ให้บริการ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onToggleMap}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              {showMap ? <EyeOff className="w-3.5 h-3.5" /> : <Map className="w-3.5 h-3.5 text-blue-400" />}
              <span>{showMap ? 'ซ่อนแผนที่' : 'แผนที่'}</span>
            </button>

            {selectedCount > 0 && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Vehicle Class Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full md:w-auto justify-center">
          <button
            onClick={() => onVehicleClassChange('class_1')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              vehicleClass === 'class_1'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>รถ 4 ล้อ</span>
          </button>

          <button
            onClick={() => onVehicleClassChange('class_2')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              vehicleClass === 'class_2'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>6-10 ล้อ</span>
          </button>

          <button
            onClick={() => onVehicleClassChange('class_3')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              vehicleClass === 'class_3'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Truck className="w-4 h-4 stroke-[2.5]" />
            <span>&gt;10 ล้อ</span>
          </button>
        </div>

        {/* Header Action Buttons (Toggle Map & Admin) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Toggle Map View Button */}
          <button
            onClick={onToggleMap}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              showMap
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-blue-900/60 text-blue-300 border-blue-600/50 hover:bg-blue-800'
            }`}
          >
            {showMap ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Map className="w-4 h-4 text-blue-400" />}
            <span>{showMap ? 'ซ่อนแผนที่ (Hide Map)' : 'แสดงแผนที่ (Show Map)'}</span>
          </button>

          {/* Admin Dashboard Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs border border-amber-400/30 shadow-md shadow-amber-600/20 transition"
          >
            <Settings className="w-4 h-4" />
            <span>Admin Dashboard (แก้ไขพิกัดด่าน)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
