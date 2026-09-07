import React from 'react';
import { PresetRoute, TollPlaza } from '../types/toll';
import { PRESET_ROUTES } from '../data/tollNetwork';
import { PLAZA_MAP } from '../utils/fareEngine';
import { Flame, PlaneTakeoff, PlaneLanding, Truck, Route, Car, Zap } from 'lucide-react';

interface PopularRoutesProps {
  onSelectPreset: (origin: TollPlaza, destination: TollPlaza) => void;
  activeOriginId?: string;
  activeDestinationId?: string;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'plane-takeoff':
      return <PlaneTakeoff className="w-3.5 h-3.5 text-blue-400" />;
    case 'plane-landing':
      return <PlaneLanding className="w-3.5 h-3.5 text-indigo-400" />;
    case 'truck':
      return <Truck className="w-3.5 h-3.5 text-amber-400" />;
    case 'route':
      return <Route className="w-3.5 h-3.5 text-teal-400" />;
    default:
      return <Car className="w-3.5 h-3.5 text-purple-400" />;
  }
};

export const PopularRoutes: React.FC<PopularRoutesProps> = ({
  onSelectPreset,
  activeOriginId,
  activeDestinationId,
}) => {
  return (
    <div className="relative z-10 glass-panel p-2.5 sm:p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {/* Compact Section Label */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 flex-shrink-0">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span className="whitespace-nowrap">เลือกด่วน:</span>
      </div>

      {/* Horizontal Pill Wrap / Scroll */}
      <div className="flex flex-wrap items-center gap-1.5 w-full overflow-x-auto custom-scrollbar pb-0.5 sm:pb-0">
        {PRESET_ROUTES.map((route) => {
          const originPlaza = PLAZA_MAP.get(route.origin_id);
          const destinationPlaza = PLAZA_MAP.get(route.destination_id);
          if (!originPlaza || !destinationPlaza) return null;

          const isActive =
            activeOriginId === route.origin_id &&
            activeDestinationId === route.destination_id;

          return (
            <button
              key={route.id}
              onClick={() => onSelectPreset(originPlaza, destinationPlaza)}
              className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-xs font-medium transition whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80'
              }`}
              title={route.description_th}
            >
              {getIcon(route.icon)}
              <span>{route.title_th}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
