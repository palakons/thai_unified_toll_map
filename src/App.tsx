import React, { useState, useMemo } from 'react';
import { TollPlaza, TollEdge, VehicleClass, FareCalculationResult } from './types/toll';
import { TOLL_PLAZAS, TOLL_EDGES } from './data/tollNetwork';
import { calculateRoute, getValidDestinationsForOrigin } from './utils/fareEngine';
import { Header } from './components/Header';
import { RouteSelector } from './components/RouteSelector';
import { MapView } from './components/MapView';
import { FareBreakdown } from './components/FareBreakdown';
import { PopularRoutes } from './components/PopularRoutes';
import { AdminDashboard } from './components/AdminDashboard';
import { Info, ShieldCheck, Lock } from 'lucide-react';

const LOCAL_PLAZAS_KEY = 'tollmap_custom_plazas_v1';
const LOCAL_EDGES_KEY = 'tollmap_custom_edges_v1';

export const App: React.FC = () => {
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>('class_1');
  const [showMap, setShowMap] = useState<boolean>(true);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Plazas state with LocalStorage persistence
  const [plazas, setPlazas] = useState<TollPlaza[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PLAZAS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved plazas:', e);
    }
    return TOLL_PLAZAS;
  });

  // Edges state with LocalStorage persistence
  const [edges, setEdges] = useState<TollEdge[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_EDGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved edges:', e);
    }
    return TOLL_EDGES;
  });

  const [originPlaza, setOriginPlaza] = useState<TollPlaza | null>(() => plazas[0] || null);
  const [destinationPlaza, setDestinationPlaza] = useState<TollPlaza | null>(() => plazas[1] || null);

  const handleUpdatePlazas = (newPlazas: TollPlaza[]) => {
    setPlazas(newPlazas);
    localStorage.setItem(LOCAL_PLAZAS_KEY, JSON.stringify(newPlazas));
  };

  const handleUpdateEdges = (newEdges: TollEdge[]) => {
    setEdges(newEdges);
    localStorage.setItem(LOCAL_EDGES_KEY, JSON.stringify(newEdges));
  };

  const handleResetToDefault = () => {
    if (confirm('คุณต้องการคืนค่าตำแหน่งด่านเป็นค่าเริ่มต้นของภาครัฐใช่หรือไม่?')) {
      setPlazas(TOLL_PLAZAS);
      setEdges(TOLL_EDGES);
      localStorage.removeItem(LOCAL_PLAZAS_KEY);
      localStorage.removeItem(LOCAL_EDGES_KEY);
      setOriginPlaza(TOLL_PLAZAS[0]);
      setDestinationPlaza(TOLL_PLAZAS[1]);
    }
  };

  // Recalculate route whenever origin, destination, or vehicle class changes
  const fareResult = useMemo<FareCalculationResult | null>(() => {
    if (!originPlaza || !destinationPlaza) return null;
    return calculateRoute(originPlaza.id, destinationPlaza.id, vehicleClass);
  }, [originPlaza, destinationPlaza, vehicleClass]);

  const handleSwap = () => {
    const temp = originPlaza;
    setOriginPlaza(destinationPlaza);
    setDestinationPlaza(temp);
  };

  const handleReset = () => {
    setOriginPlaza(null);
    setDestinationPlaza(null);
  };

  const handleSelectPreset = (origin: TollPlaza, destination: TollPlaza) => {
    setOriginPlaza(origin);
    setDestinationPlaza(destination);
  };

  const selectedCount = (originPlaza ? 1 : 0) + (destinationPlaza ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* App Header */}
      <Header
        vehicleClass={vehicleClass}
        onVehicleClassChange={setVehicleClass}
        onReset={handleReset}
        selectedCount={selectedCount}
        showMap={showMap}
        onToggleMap={() => setShowMap(!showMap)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Control Section: Route Selector & Presets */}
        <div className="space-y-4">
          <RouteSelector
            plazas={plazas}
            originPlaza={originPlaza}
            destinationPlaza={destinationPlaza}
            onSelectOrigin={(p) => {
              setOriginPlaza(p);
              if (p) {
                const validDests = getValidDestinationsForOrigin(p, plazas);
                if (destinationPlaza && !validDests.some((v) => v.id === destinationPlaza.id)) {
                  setDestinationPlaza(null);
                }
              }
            }}
            onSelectDestination={setDestinationPlaza}
            onSwap={handleSwap}
          />

          <PopularRoutes
            onSelectPreset={handleSelectPreset}
            activeOriginId={originPlaza?.id}
            activeDestinationId={destinationPlaza?.id}
          />
        </div>

        {/* Dynamic Responsive Grid: Map View (Toggleable) + Fare Result Panel */}
        <div className={`grid grid-cols-1 ${showMap ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6`}>
          {/* Map View Column */}
          {showMap && (
            <div className="lg:col-span-7 h-[450px] lg:h-[620px] rounded-2xl overflow-hidden animate-fade-in">
              <MapView
                plazas={plazas}
                originPlaza={originPlaza}
                destinationPlaza={destinationPlaza}
                routeCoords={fareResult?.full_route_coords || []}
                onSelectOrigin={(p) => {
                  setOriginPlaza(p);
                  if (p) {
                    const validDests = getValidDestinationsForOrigin(p, plazas);
                    if (destinationPlaza && !validDests.some((v) => v.id === destinationPlaza.id)) {
                      setDestinationPlaza(null);
                    }
                  }
                }}
                onSelectDestination={setDestinationPlaza}
              />
            </div>
          )}

          {/* Fare Result & Breakdown Column */}
          <div className={`${showMap ? 'lg:col-span-5' : 'lg:col-span-1 max-w-3xl mx-auto w-full'} flex flex-col justify-start`}>
            <FareBreakdown
              result={fareResult}
              originName={originPlaza?.name_th}
              destinationName={destinationPlaza?.name_th}
              vehicleClass={vehicleClass}
            />
          </div>
        </div>

        {/* Info & Disclaimer Footer Banner */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>
              อัปเดตอัตราค่าผ่านทาง กทพ. / BEM / DMT / กรมทางหลวง 2026 คำนวณตามประเภทสายทาง (Same Line & Flat-rate)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>จำกัดเลือกจุดขึ้น-ลง เฉพาะในสายทางเดียวกัน (หรือระบบอัตราแบนราบ)</span>
          </div>
        </div>
      </main>

      {/* Admin Dashboard Modal */}
      {isAdminOpen && (
        <AdminDashboard
          plazas={plazas}
          edges={edges}
          onUpdatePlazas={handleUpdatePlazas}
          onUpdateEdges={handleUpdateEdges}
          onResetToDefault={handleResetToDefault}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-900 bg-slate-950">
        <p>© 2026 Thailand Tollway Fare Calculator | Same-Line & Flat-rate System</p>
      </footer>
    </div>
  );
};

export default App;
