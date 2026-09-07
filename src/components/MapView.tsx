import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { TollPlaza, Operator } from '../types/toll';
import { OPERATORS } from '../data/tollNetwork';
import { MapPin, Navigation, Edit2 } from 'lucide-react';

interface MapViewProps {
  plazas: TollPlaza[];
  originPlaza?: TollPlaza | null;
  destinationPlaza?: TollPlaza | null;
  routeCoords?: [number, number][];
  onSelectOrigin?: (plaza: TollPlaza) => void;
  onSelectDestination?: (plaza: TollPlaza) => void;
  isAdminMode?: boolean;
  onDragPlaza?: (plazaId: string, newCoords: [number, number]) => void;
  onMapClickAdd?: (coords: [number, number]) => void;
  onEditPlaza?: (plaza: TollPlaza) => void;
  reachablePlazaIds?: Set<string> | null;
}

const MapAutoBounds: React.FC<{
  coords: [number, number][];
  origin: TollPlaza | null;
  destination: TollPlaza | null;
}> = ({ coords, origin, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (coords && coords.length > 1) {
      const bounds = L.latLngBounds(coords.map((c) => [c[0], c[1]]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (origin && destination) {
      const bounds = L.latLngBounds([origin.coords, destination.coords]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    } else if (origin) {
      map.setView(origin.coords, 13);
    } else if (destination) {
      map.setView(destination.coords, 13);
    }
  }, [map, coords, origin, destination]);

  return null;
};

// Component to handle map clicks for adding new plaza in Admin Mode
const MapClickHandler: React.FC<{
  isAdminMode?: boolean;
  onMapClickAdd?: (coords: [number, number]) => void;
}> = ({ isAdminMode, onMapClickAdd }) => {
  useMapEvents({
    click(e) {
      if (isAdminMode && onMapClickAdd) {
        onMapClickAdd([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
};

// Generate Leaflet SVG pin icon for operators
const createPlazaMarkerIcon = (
  operator: Operator,
  isOrigin: boolean,
  isDestination: boolean,
  isAdminMode?: boolean,
  isUnreachable?: boolean
) => {
  const opInfo = OPERATORS[operator];
  const color = isOrigin ? '#10B981' : isDestination ? '#EF4444' : isUnreachable ? '#64748B' : opInfo.color;
  const size = isOrigin || isDestination ? 34 : isAdminMode ? 30 : isUnreachable ? 22 : 26;
  const opacity = isUnreachable ? '0.35' : isOrigin || isDestination ? '1' : '0.9';

  const svgHtml = `
    <div class="relative flex items-center justify-center ${
      isOrigin || isDestination ? 'selected-pin-pulse z-50' : ''
    } ${isUnreachable ? 'opacity-40 grayscale hover:opacity-80 transition-opacity' : ''}" style="width: ${size}px; height: ${size}px;">
      <svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="16" fill="${color}" fill-opacity="${opacity}" stroke="${isUnreachable ? '#475569' : '#FFFFFF'}" stroke-width="${isAdminMode ? '3' : isOrigin || isDestination ? '3' : '2'}"/>
        ${
          isOrigin
            ? `<polygon points="18,8 21,15 28,15 22,19 24,26 18,22 12,26 14,19 8,15 15,15" fill="#FFFFFF"/>`
            : isDestination
            ? `<circle cx="18" cy="18" r="7" fill="#FFFFFF"/>`
            : `<text x="18" y="22" font-size="11" font-weight="bold" fill="#FFFFFF" fill-opacity="${isUnreachable ? '0.7' : '1'}" text-anchor="middle">${operator.substring(
                0,
                3
              )}</text>`
        }
      </svg>
      ${
        isAdminMode
          ? `<span class="absolute -top-5 px-1 rounded bg-amber-600 text-white text-[9px] font-bold shadow-md cursor-grab">ลากเพื่อย้าย</span>`
          : isOrigin
          ? `<span class="absolute -top-6 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold shadow-md">จุดขึ้น</span>`
          : isDestination
          ? `<span class="absolute -top-6 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold shadow-md">จุดลง</span>`
          : isUnreachable
          ? `<span class="absolute -top-5 px-1 rounded bg-slate-800/90 text-slate-400 text-[8px] border border-slate-700 hidden hover:block">ไม่เชื่อมต่อ</span>`
          : ''
      }
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: `custom-leaflet-pin ${isAdminMode ? 'cursor-grab active:cursor-grabbing' : ''}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

export const MapView: React.FC<MapViewProps> = ({
  plazas,
  originPlaza = null,
  destinationPlaza = null,
  routeCoords = [],
  onSelectOrigin,
  onSelectDestination,
  isAdminMode = false,
  onDragPlaza,
  onMapClickAdd,
  onEditPlaza,
  reachablePlazaIds = null,
}) => {
  const centerBangkok: [number, number] = [13.7563, 100.5018];

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer
        center={centerBangkok}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full dark-map-tiles"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {!isAdminMode && (
          <MapAutoBounds
            coords={routeCoords}
            origin={originPlaza}
            destination={destinationPlaza}
          />
        )}

        <MapClickHandler isAdminMode={isAdminMode} onMapClickAdd={onMapClickAdd} />

        {/* Route Polyline */}
        {routeCoords && routeCoords.length > 1 && !isAdminMode && (
          <>
            <Polyline
              positions={routeCoords}
              pathOptions={{
                color: '#3B82F6',
                weight: 8,
                opacity: 0.4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            <Polyline
              positions={routeCoords}
              pathOptions={{
                color: '#60A5FA',
                weight: 4,
                opacity: 0.95,
                dashArray: '8, 6',
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </>
        )}

        {/* Toll Plaza Markers */}
        {plazas.map((plaza) => {
          const isOrigin = originPlaza?.id === plaza.id;
          const isDestination = destinationPlaza?.id === plaza.id;
          const isUnreachable =
            !isAdminMode &&
            reachablePlazaIds !== null &&
            !reachablePlazaIds.has(plaza.id) &&
            !isOrigin &&
            !isDestination;

          const icon = createPlazaMarkerIcon(
            plaza.operator,
            isOrigin,
            isDestination,
            isAdminMode,
            isUnreachable
          );
          const opInfo = OPERATORS[plaza.operator];

          return (
            <Marker
              key={plaza.id}
              position={plaza.coords}
              icon={icon}
              draggable={isAdminMode}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  if (marker && onDragPlaza) {
                    const latLng = marker.getLatLng();
                    onDragPlaza(plaza.id, [latLng.lat, latLng.lng]);
                  }
                },
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 min-w-[210px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                      style={{ backgroundColor: isUnreachable ? '#64748B' : opInfo.color }}
                    >
                      {plaza.operator}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {plaza.expressway_line}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-0.5">{plaza.name_th}</h3>
                  <p className="text-xs text-slate-300 font-light mb-1">{plaza.name_en}</p>

                  <div className="text-[11px] font-mono text-emerald-400 mb-2 bg-slate-900 px-2 py-1 rounded">
                    GPS: [{plaza.coords[0].toFixed(5)}, {plaza.coords[1].toFixed(5)}]
                  </div>

                  {isUnreachable && (
                    <div className="mb-2 p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 flex items-center gap-1.5">
                      <span>⚠️ ไม่มีเส้นทางเชื่อมต่อจากจุดที่เลือก (Unreachable via graph)</span>
                    </div>
                  )}

                  {isAdminMode ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => onEditPlaza && onEditPlaza(plaza)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>แก้ไขข้อมูลด่าน</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      {onSelectOrigin && (
                        <button
                          onClick={() => !isUnreachable && onSelectOrigin(plaza)}
                          disabled={isUnreachable && destinationPlaza !== null}
                          className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isOrigin
                              ? 'bg-emerald-600 text-white'
                              : isUnreachable && destinationPlaza !== null
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                              : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50'
                          }`}
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>{isOrigin ? 'จุดขึ้น (แล้ว)' : 'ตั้งเป็นจุดขึ้น'}</span>
                        </button>
                      )}

                      {onSelectDestination && (
                        <button
                          onClick={() => !isUnreachable && onSelectDestination(plaza)}
                          disabled={isUnreachable && originPlaza !== null}
                          className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isDestination
                              ? 'bg-rose-600 text-white'
                              : isUnreachable && originPlaza !== null
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                              : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/50'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{isDestination ? 'จุดลง (แล้ว)' : 'ตั้งเป็นจุดลง'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend / Admin Status Indicator */}
      {isAdminMode ? (
        <div className="absolute top-3 left-3 z-[400] glass-panel px-3 py-2 rounded-xl text-xs flex items-center gap-2 border border-amber-500/40 text-amber-300 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span>โหมดปรับแต่งพิกัด GPS: คลิกบนแผนที่เพื่อสร้างด่านใหม่ หรือ ลากหมุดเพื่อปรับตำแหน่ง</span>
        </div>
      ) : (
        <div className="absolute bottom-3 left-3 z-[400] glass-panel px-3 py-2 rounded-xl text-xs flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>จุดขึ้น (Origin)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>จุดลง (Exit)</span>
          </div>
          {reachablePlazaIds !== null && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 opacity-60" />
              <span>ไม่เชื่อมต่อ (Unreachable)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
