import React, { useState, useMemo, useEffect } from 'react';
import { TollPlaza, TollEdge, VehicleClass, FareCalculationResult } from './types/toll';
import { TOLL_PLAZAS, TOLL_EDGES } from './data/tollNetwork';
import {
  calculateRoute,
  getValidDestinationsForOrigin,
  getStrictReachableDestinations,
  getStrictReachableOrigins,
} from './utils/fareEngine';
import { Header } from './components/Header';
import { RouteSelector } from './components/RouteSelector';
import { MapView } from './components/MapView';
import { FareBreakdown } from './components/FareBreakdown';
import { PopularRoutes } from './components/PopularRoutes';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { LineExplorer } from './components/LineExplorer';
import { TollNetworkGraphView } from './components/TollNetworkGraphView';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const LOCAL_PLAZAS_KEY = 'tollmap_custom_plazas_v1';
const LOCAL_EDGES_KEY = 'tollmap_custom_edges_v1';
const AUTH_STORAGE_KEY = 'cartoll_admin_auth_v1';

export const App: React.FC = () => {
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>('class_1');
  const [showMap, setShowMap] = useState<boolean>(true);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'map' | 'lines_graph'>('map');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detect secret URL /mapedit or #mapedit or ?admin=true
  useEffect(() => {
    const checkSecretUrl = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      const isSecretUrl =
        path.includes('/mapedit') ||
        hash.includes('mapedit') ||
        search.includes('admin') ||
        search.includes('mapedit');

      if (isSecretUrl) {
        if (sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true') {
          setIsAdminOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    checkSecretUrl();
    window.addEventListener('popstate', checkSecretUrl);
    window.addEventListener('hashchange', checkSecretUrl);
    return () => {
      window.removeEventListener('popstate', checkSecretUrl);
      window.removeEventListener('hashchange', checkSecretUrl);
    };
  }, []);

  const handleOpenAdminTrigger = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
    showToast('เข้าสู่ระบบผู้ดูแลระบบสำเร็จ (Map Editor Active)');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAdminOpen(false);
    setIsLoginModalOpen(false);
    if (window.location.pathname.includes('/mapedit') || window.location.hash.includes('mapedit')) {
      window.history.pushState({}, '', '/');
    }
    showToast('ออกจากระบบผู้ดูแลเรียบร้อย');
  };

  // Plazas state with LocalStorage persistence + Automatic Default Sync
  const [plazas, setPlazas] = useState<TollPlaza[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PLAZAS_KEY);
      if (saved) {
        const parsed: TollPlaza[] = JSON.parse(saved);
        const savedIds = new Set(parsed.map((p) => p.id));
        const missingDefaults = TOLL_PLAZAS.filter((p) => !savedIds.has(p.id));
        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults];
          localStorage.setItem(LOCAL_PLAZAS_KEY, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved plazas:', e);
    }
    return TOLL_PLAZAS;
  });

  // Edges state with LocalStorage persistence + Automatic Default Sync
  const [edges, setEdges] = useState<TollEdge[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_EDGES_KEY);
      if (saved) {
        const parsed: TollEdge[] = JSON.parse(saved);
        const savedIds = new Set(parsed.map((e) => e.id));
        const missingDefaults = TOLL_EDGES.filter((e) => !savedIds.has(e.id));
        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults];
          localStorage.setItem(LOCAL_EDGES_KEY, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved edges:', e);
    }
    return TOLL_EDGES;
  });

  const [originPlaza, setOriginPlaza] = useState<TollPlaza | null>(() => plazas[0] || null);
  const [destinationPlaza, setDestinationPlaza] = useState<TollPlaza | null>(() => plazas[1] || null);

  // Sync across tabs if someone updates plazas/edges in another window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_PLAZAS_KEY && e.newValue) {
        try {
          setPlazas(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === LOCAL_EDGES_KEY && e.newValue) {
        try {
          setEdges(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
      showToast('คืนค่าเริ่มต้นและอัปเดตแผนที่สำเร็จ');
    }
  };

  const handleRefreshMap = () => {
    try {
      const savedPlazas = localStorage.getItem(LOCAL_PLAZAS_KEY);
      const savedEdges = localStorage.getItem(LOCAL_EDGES_KEY);
      if (savedPlazas) {
        setPlazas(JSON.parse(savedPlazas));
      } else {
        setPlazas([...TOLL_PLAZAS]);
      }
      if (savedEdges) {
        setEdges(JSON.parse(savedEdges));
      } else {
        setEdges([...TOLL_EDGES]);
      }
    } catch (e) {
      setPlazas([...TOLL_PLAZAS]);
      setEdges([...TOLL_EDGES]);
    }
    showToast('อัปเดตข้อมูลโครงข่ายแผนที่ล่าสุดสำเร็จ');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute reachable plaza IDs based strictly on the graph
  const reachablePlazaIds = useMemo<Set<string> | null>(() => {
    if (originPlaza && !destinationPlaza) {
      return getStrictReachableDestinations(originPlaza.id, plazas, edges);
    }
    if (destinationPlaza && !originPlaza) {
      return getStrictReachableOrigins(destinationPlaza.id, plazas, edges);
    }
    if (originPlaza && destinationPlaza) {
      return getStrictReachableDestinations(originPlaza.id, plazas, edges);
    }
    return null;
  }, [originPlaza, destinationPlaza, plazas, edges]);

  // Recalculate route whenever origin, destination, vehicle class, or dynamic graph data changes
  const fareResult = useMemo<FareCalculationResult | null>(() => {
    if (!originPlaza || !destinationPlaza) return null;
    return calculateRoute(originPlaza.id, destinationPlaza.id, vehicleClass, plazas, edges);
  }, [originPlaza, destinationPlaza, vehicleClass, plazas, edges]);

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
    setActiveView('map');
  };

  const selectedCount = (originPlaza ? 1 : 0) + (destinationPlaza ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* App Header with CarToll branding & Navigation Tabs */}
      <Header
        vehicleClass={vehicleClass}
        onVehicleClassChange={setVehicleClass}
        onReset={handleReset}
        selectedCount={selectedCount}
        showMap={showMap}
        onToggleMap={() => setShowMap(!showMap)}
        onOpenAdmin={handleOpenAdminTrigger}
        isAdminAuthenticated={isAdminAuthenticated}
        onLogoutAdmin={handleLogoutAdmin}
        activeView={activeView}
        onViewChange={setActiveView}
        onRefreshMap={handleRefreshMap}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeView === 'map' ? (
          <>
            {/* Top Control Section: Route Selector & Presets */}
            <div className="space-y-4">
              <RouteSelector
                plazas={plazas}
                edges={edges}
                originPlaza={originPlaza}
                destinationPlaza={destinationPlaza}
                onSelectOrigin={(p) => {
                  setOriginPlaza(p);
                  if (p) {
                    const validDests = getValidDestinationsForOrigin(p, plazas, edges);
                    if (destinationPlaza && !validDests.some((v) => v.id === destinationPlaza.id)) {
                      setDestinationPlaza(null);
                    }
                  }
                }}
                onSelectDestination={setDestinationPlaza}
                onSwap={handleSwap}
              />

              <PopularRoutes
                plazas={plazas}
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
                    legs={fareResult?.legs || []}
                    reachablePlazaIds={reachablePlazaIds}
                    onSelectOrigin={(p) => {
                      setOriginPlaza(p);
                      if (p) {
                        const validDests = getValidDestinationsForOrigin(p, plazas, edges);
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
                  CarToll (ค่าโทลล์) อัปเดตอัตราค่าผ่านทาง กทพ. / BEM / DMT / กรมทางหลวง 2026
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>คำนวณเส้นทางเฉพาะด่านที่เชื่อมต่อถึงกันได้ตามผังโครงข่ายทางด่วนจริง</span>
              </div>
            </div>
          </>
        ) : (
          /* New Page: Toll Lines & Network Graph View */
          <TollNetworkGraphView
            plazas={plazas}
            edges={edges}
            onSelectOriginAndGo={(p) => {
              setOriginPlaza(p);
              const validDests = getValidDestinationsForOrigin(p, plazas, edges);
              if (destinationPlaza && !validDests.some((v) => v.id === destinationPlaza.id)) {
                setDestinationPlaza(null);
              }
              setActiveView('map');
            }}
            onSelectDestinationAndGo={(p) => {
              setDestinationPlaza(p);
              setActiveView('map');
            }}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel px-4 py-3 rounded-2xl border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toll Line Explorer Modal (quick search helper) */}
      {isExplorerOpen && (
        <LineExplorer
          plazas={plazas}
          originPlaza={originPlaza}
          destinationPlaza={destinationPlaza}
          onSelectOrigin={(p) => {
            setOriginPlaza(p);
            const validDests = getValidDestinationsForOrigin(p, plazas, edges);
            if (destinationPlaza && !validDests.some((v) => v.id === destinationPlaza.id)) {
              setDestinationPlaza(null);
            }
          }}
          onSelectDestination={setDestinationPlaza}
          onClose={() => setIsExplorerOpen(false)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

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
        <p>© 2026 CarToll (ค่าโทลล์) | Thailand Expressway & Tollway Network Graph</p>
      </footer>
    </div>
  );
};

export default App;
