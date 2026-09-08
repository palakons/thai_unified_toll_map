import React, { useState } from 'react';
import { VehicleClass } from '../types/toll';
import { Car, Truck, RotateCw, Map, GitFork, Settings, LogOut, Lock } from 'lucide-react';

interface HeaderProps {
  vehicleClass: VehicleClass;
  onVehicleClassChange: (vc: VehicleClass) => void;
  onReset: () => void;
  selectedCount: number;
  showMap: boolean;
  onToggleMap: () => void;
  onOpenAdmin: () => void;
  isAdminAuthenticated?: boolean;
  onLogoutAdmin?: () => void;
  activeView: 'map' | 'lines_graph';
  onViewChange: (view: 'map' | 'lines_graph') => void;
  onRefreshMap: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  vehicleClass,
  onVehicleClassChange,
  onReset,
  selectedCount,
  showMap,
  onToggleMap,
  onOpenAdmin,
  isAdminAuthenticated,
  onLogoutAdmin,
  activeView,
  onViewChange,
  onRefreshMap,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefreshMap();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Logo: CarToll (ค่าโทลล์) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onViewChange('map')}>
            {/* Custom Automotive CarToll Badge Logo */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/25 flex-shrink-0 group hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Car roof & body */}
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H7c-.7 0-1.3.3-1.8.7C4.3 8.6 3 10 3 10s-2.7.6-4.5 1.1C-2.3 11.3-3 12.1-3 13v3c0 .6.4 1 1 1h2" />
                {/* Highway barrier symbol */}
                <path d="M4 15h16" />
                <circle cx="7.5" cy="17.5" r="2.5" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
                <circle cx="16.5" cy="17.5" r="2.5" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
                {/* Toll gate arm */}
                <line x1="2" y1="5" x2="14" y2="5" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 2" />
                <circle cx="2" cy="5" r="1.5" fill="#F59E0B" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-xl text-white tracking-tight leading-none flex items-center">
                  <span>Car</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Toll</span>
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 tracking-wider">
                  ค่าโทลล์
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-light mt-0.5">
                ระบบคำนวณค่าผ่านทางและผังโครงข่ายทางด่วนไทย
              </p>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => onViewChange(activeView === 'map' ? 'lines_graph' : 'map')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
                activeView === 'lines_graph'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>{activeView === 'lines_graph' ? 'แผนที่' : 'ผังสายทาง'}</span>
            </button>

            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="รีเฟรชแผนที่"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Calculator Map vs Lines & Graph) */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full md:w-auto justify-center">
          <button
            onClick={() => onViewChange('map')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'map'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>แผนที่คำนวณราคา (Map)</span>
          </button>

          <button
            onClick={() => onViewChange('lines_graph')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'lines_graph'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>สายทางและผังโครงข่าย (Lines & Graph)</span>
          </button>
        </div>

        {/* Vehicle Class Selector Tabs & Desktop Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* Vehicle Class Selector */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onVehicleClassChange('class_1')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                vehicleClass === 'class_1'
                  ? 'bg-blue-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>4 ล้อ</span>
            </button>

            <button
              onClick={() => onVehicleClassChange('class_2')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                vehicleClass === 'class_2'
                  ? 'bg-blue-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>6-10 ล้อ</span>
            </button>

            <button
              onClick={() => onVehicleClassChange('class_3')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                vehicleClass === 'class_3'
                  ? 'bg-blue-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>&gt;10 ล้อ</span>
            </button>
          </div>

          {/* Desktop Refresh Map Button */}
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition active:scale-95 shadow-sm"
            title="รีเฟรชข้อมูลแผนที่ล่าสุด (Refresh Map & Bust Cache)"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
            <span>{isRefreshing ? 'กำลังอัปเดต...' : 'รีเฟรชแผนที่'}</span>
          </button>

          {/* Discreet Admin Control Badge when authenticated */}
          {isAdminAuthenticated && (
            <div className="flex items-center gap-1.5 bg-amber-950/70 p-1 rounded-xl border border-amber-500/40 animate-fade-in shadow-md">
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition"
                title="เปิดเครื่องมือแก้ไขแผนที่ (Map Editor)"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>แก้ไขแผนที่</span>
              </button>
              <button
                onClick={onLogoutAdmin}
                className="p-1 rounded-lg text-amber-300 hover:text-white hover:bg-amber-900/60 text-xs transition"
                title="ออกจากระบบผู้ดูแล"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
