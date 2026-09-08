import React, { useState, useMemo } from 'react';
import { TollPlaza, TollEdge, Operator } from '../types/toll';
import { OPERATORS, getLineColor } from '../data/tollNetwork';
import { PaymentBadge } from './PaymentBadge';
import { isFlatRateLine } from '../utils/fareEngine';
import {
  GitFork,
  Layers,
  Search,
  Navigation,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Network,
} from 'lucide-react';

interface TollNetworkGraphViewProps {
  plazas: TollPlaza[];
  edges: TollEdge[];
  onSelectOriginAndGo: (plaza: TollPlaza) => void;
  onSelectDestinationAndGo: (plaza: TollPlaza) => void;
}

// Major interchange nodes that link multiple expressway systems
const INTERCHANGE_HUBS = [
  {
    id: 'hub-dindaeng',
    name: 'ชุมทางดินแดง (Din Daeng Interchange)',
    lines: ['ทางยกระดับอุตราภิมุข (DMT)', 'ทางพิเศษเฉลิมมหานคร (EXAT)', 'ทางพิเศษศรีรัช (BEM)'],
    description: 'จุดเชื่อมต่อหลักใจกลางกรุงเทพฯ ระหว่างโทลล์เวย์วิภาวดี, ด่วนขั้นที่ 1 (ดินแดง), และด่วนขั้นที่ 2 (อโศก/ศรีรัช)',
    operators: ['DMT', 'EXAT', 'BEM'],
    color: '#F59E0B',
    plazaIds: ['dmt-din-daeng', 'exat-din-daeng', 'bem-asoke-1'],
  },
  {
    id: 'hub-asoke',
    name: 'ชุมทางอโศก - มักกะสัน (Asoke - Makkasan)',
    lines: ['ทางพิเศษศรีรัช (BEM)', 'ทางพิเศษเฉลิมมหานคร (EXAT)'],
    description: 'จุดเปลี่ยนถ่ายระหว่างระบบทางด่วนขั้นที่ 1 และ 2 มุ่งหน้าพระราม 9, บางนา, และแจ้งวัฒนะ',
    operators: ['BEM', 'EXAT'],
    color: '#8B5CF6',
    plazaIds: ['bem-asoke-1', 'exat-din-daeng'],
  },
  {
    id: 'hub-bangna',
    name: 'ชุมทางบางนา กม.6 / สาย S1 (Bang Na - S1)',
    lines: ['ทางพิเศษเฉลิมมหานคร (EXAT)', 'ทางพิเศษบูรพาวิถี (EXAT)'],
    description: 'จุดเชื่อมต่อทางด่วนขั้นที่ 1 เข้าสู่ทางพิเศษยกระดับบูรพาวิถีมุ่งหน้าสุวรรณภูมิและชลบุรี',
    operators: ['EXAT'],
    color: '#3B82F6',
    plazaIds: ['exat-bang-na-km6', 'exat-at-narong-1'],
  },
  {
    id: 'hub-phaya-thai',
    name: 'ชุมทางพญาไท (Phaya Thai Interchange)',
    description: 'จุดตัดใจกลางเมือง ทางพิเศษเฉลิมมหานคร ↔ ทางพิเศษศรีรัช (ส่วน A, B, CD)',
    lines: ['ทางพิเศษเฉลิมมหานคร', 'ทางพิเศษศรีรัช'],
    operators: ['EXAT', 'BEM'],
    color: '#7C3AED',
  },
  {
    id: 'hub-bang-sue',
    name: 'ต่างระดับบางซื่อ / หมอชิต (Bang Sue Interchange)',
    description: 'จุดเชื่อมต่อต่างระดับ ทางพิเศษศรีรัช ↔ ทางพิเศษประจิมรัถยา (ไปตลิ่งชัน/ศาลายา)',
    lines: ['ทางพิเศษศรีรัช', 'ทางพิเศษประจิมรัถยา'],
    operators: ['BEM'],
    color: '#6366F1',
  },
  {
    id: 'hub-rama9',
    name: 'ชุมทางพระราม 9 (Rama 9 Interchange)',
    description: 'จุดเชื่อมต่อต่างระดับ ทางพิเศษศรีรัช (ส่วน D) ↔ ทางพิเศษฉลองรัช (รามอินทรา)',
    lines: ['ทางพิเศษศรีรัช', 'ทางพิเศษฉลองรัช'],
    operators: ['BEM', 'EXAT'],
    color: '#06B6D4',
  },
];

export const TollNetworkGraphView: React.FC<TollNetworkGraphViewProps> = ({
  plazas,
  edges,
  onSelectOriginAndGo,
  onSelectDestinationAndGo,
}) => {
  const [selectedOperator, setSelectedOperator] = useState<Operator | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLine, setExpandedLine] = useState<string>('');

  // Group plazas by expressway line
  const lineGroups = useMemo(() => {
    const map = new Map<string, { operator: Operator; plazas: TollPlaza[] }>();

    for (const plaza of plazas) {
      const key = plaza.expressway_line.trim();
      if (!map.has(key)) {
        map.set(key, { operator: plaza.operator, plazas: [] });
      }
      map.get(key)!.plazas.push(plaza);
    }

    const groups: { lineName: string; operator: Operator; isFlatRate: boolean; plazas: TollPlaza[] }[] = [];
    map.forEach((val, lineName) => {
      groups.push({
        lineName,
        operator: val.operator,
        isFlatRate: isFlatRateLine(lineName),
        plazas: val.plazas,
      });
    });

    return groups;
  }, [plazas]);

  const filteredGroups = useMemo(() => {
    return lineGroups.filter((g) => {
      if (selectedOperator !== 'ALL' && g.operator !== selectedOperator) return false;
      if (!searchTerm.trim()) return true;
      const lower = searchTerm.toLowerCase().trim();
      return (
        g.lineName.toLowerCase().includes(lower) ||
        g.operator.toLowerCase().includes(lower) ||
        g.plazas.some((p) => p.name_th.toLowerCase().includes(lower) || p.name_en.toLowerCase().includes(lower) || (p.section && p.section.toLowerCase().includes(lower)))
      );
    });
  }, [lineGroups, selectedOperator, searchTerm]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <Network className="w-3.5 h-3.5 text-blue-400" />
              <span>ผังทางด่วนไทยฉบับรวมศูนย์ (Unified Toll Graph)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ผังโครงข่ายสายทางด่วนและชุมทางเชื่อมต่อ (Network Topology Graph)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              สำรวจรายชื่อสายทางด่วนและมอเตอร์เวย์ทั้งหมดในประเทศไทย พร้อมผังความสัมพันธ์จุดเชื่อมต่อข้ามระบบ (Interchanges)
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-inner">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-xl font-bold text-emerald-400">{plazas.length}</div>
              <div className="text-[10px] text-slate-400 font-medium">ด่านจัดเก็บ</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-xl font-bold text-blue-400">{lineGroups.length}</div>
              <div className="text-[10px] text-slate-400 font-medium">สายทางด่วน</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xl font-bold text-amber-400">{INTERCHANGE_HUBS.length}</div>
              <div className="text-[10px] text-slate-400 font-medium">ชุมทางเชื่อมต่อ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Major Interchanges Topological Visual Graph */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                จุดเชื่อมต่อและชุมทางข้ามระบบหลัก (Key Interchange Hubs)
              </h3>
              <p className="text-xs text-slate-400 font-light">
                ชุมทางยุทธศาสตร์สำคัญที่เชื่อมต่อระหว่างทางด่วน EXAT, BEM, DMT และมอเตอร์เวย์ DOH
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs font-semibold border border-slate-800">
            {INTERCHANGE_HUBS.length} ชุมทางเชื่อมต่อ
          </span>
        </div>

        {/* Interchange Hubs Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTERCHANGE_HUBS.map((hub) => (
            <div
              key={hub.id}
              className="glass-card p-4 rounded-2xl border border-slate-800/90 hover:border-amber-500/50 transition space-y-3 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                  {hub.name}
                </h4>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {hub.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <div className="flex flex-wrap gap-1">
                  {hub.operators.map((op) => (
                    <span
                      key={op}
                      className="px-1.5 py-0.2 rounded text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: OPERATORS[op as Operator]?.color || '#3B82F6' }}
                    >
                      {op}
                    </span>
                  ))}
                </div>
                <span className="text-slate-400 font-mono">0 บาท (ทางเชื่อมฟรี)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: All Lines List Accordion */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                รายชื่อสายทางด่วนและด่านจัดเก็บแยกตามสาย (Expressway Line Matrix)
              </h3>
              <p className="text-xs text-slate-400 font-light">
                คลิกที่ชื่อสายทางเพื่อขยายดูรายชื่อด่านจัดเก็บทั้งหมดและตำแหน่ง GPS
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedOperator('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedOperator === 'ALL'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ทั้งหมด
              </button>
              {(Object.keys(OPERATORS) as Operator[]).map((opKey) => (
                <button
                  key={opKey}
                  onClick={() => setSelectedOperator(opKey)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedOperator === opKey
                      ? 'text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  style={selectedOperator === opKey ? { backgroundColor: OPERATORS[opKey].color } : {}}
                >
                  {opKey}
                </button>
              ))}
            </div>

            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาสายทาง..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Lines Accordion Grid */}
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const op = OPERATORS[group.operator];
            const lineColor = getLineColor(group.lineName, group.operator);
            const isExpanded = expandedLine === group.lineName || searchTerm.trim().length > 0;

            return (
              <div
                key={group.lineName}
                className="glass-card rounded-2xl border border-slate-800/90 overflow-hidden shadow-lg transition"
              >
                {/* Accordion Line Summary Header */}
                <div
                  onClick={() => setExpandedLine(isExpanded ? '' : group.lineName)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition select-none"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: lineColor }}
                    >
                      {group.operator}
                    </span>
                    <div>
                      <h4 className="font-bold text-base text-white leading-tight">
                        {group.lineName}
                      </h4>
                      <p className="text-xs text-slate-400 font-light mt-0.5">
                        {op.name_th} • {group.plazas.length} ด่านจัดเก็บ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Plaza List */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 pt-1 border-t border-slate-800/80 space-y-4 animate-fade-in bg-slate-950/40">
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                      <span>รายชื่อด่านทั้งหมดบนสายทางนี้ ({group.plazas.length} ด่าน):</span>
                      {op.official_source_url && (
                        <a
                          href={op.official_source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>ดูประกาศอัตราทางการ ({op.short_name})</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.plazas.map((plaza) => (
                        <div
                          key={plaza.id}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 flex flex-col justify-between space-y-3 transition group"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h5 className="font-bold text-sm text-white group-hover:text-blue-300 transition">{plaza.name_th}</h5>
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
                            <p className="text-xs text-slate-400 font-light mb-1">{plaza.name_en}</p>

                            {plaza.section && (
                              <div className="mb-2">
                                <span className="text-[10px] text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-md font-medium inline-block">
                                  📌 {plaza.section}
                                </span>
                              </div>
                            )}

                            <div className="text-[11px] font-mono text-emerald-400/90 mb-2">
                              GPS: [{plaza.coords[0].toFixed(4)}, {plaza.coords[1].toFixed(4)}]
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {plaza.payment_methods.map((pm) => (
                                <PaymentBadge key={pm} method={pm} size="sm" />
                              ))}
                            </div>
                          </div>

                          {/* Quick Route Selection Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                            {plaza.is_entry && (
                              <button
                                onClick={() => onSelectOriginAndGo(plaza)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/40 text-xs font-semibold transition"
                              >
                                <Navigation className="w-3.5 h-3.5" />
                                <span>ตั้งเป็นจุดขึ้น</span>
                              </button>
                            )}

                            {plaza.is_exit && (
                              <button
                                onClick={() => onSelectDestinationAndGo(plaza)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-700/40 text-xs font-semibold transition"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>ตั้งเป็นจุดลง</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
