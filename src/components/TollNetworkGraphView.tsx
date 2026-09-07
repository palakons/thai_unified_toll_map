import React, { useState, useMemo } from 'react';
import { TollPlaza, TollEdge, Operator } from '../types/toll';
import { OPERATORS } from '../data/tollNetwork';
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
    color: '#F59E0B',
    plazaIds: ['dmt-din-daeng', 'exat-din-daeng', 'bem-asoke-1'],
  },
  {
    id: 'hub-asoke',
    name: 'ชุมทางอโศก - มักกะสัน (Asoke - Makkasan)',
    lines: ['ทางพิเศษศรีรัช (BEM)', 'ทางพิเศษเฉลิมมหานคร (EXAT)'],
    description: 'จุดเปลี่ยนถ่ายระหว่างระบบทางด่วนขั้นที่ 1 และ 2 มุ่งหน้าพระราม 9, บางนา, และแจ้งวัฒนะ',
    color: '#8B5CF6',
    plazaIds: ['bem-asoke-1', 'exat-din-daeng'],
  },
  {
    id: 'hub-bangna',
    name: 'ชุมทางบางนา กม.6 / สาย S1 (Bang Na - S1)',
    lines: ['ทางพิเศษเฉลิมมหานคร (EXAT)', 'ทางพิเศษบูรพาวิถี (EXAT)'],
    description: 'จุดเชื่อมต่อทางด่วนขั้นที่ 1 เข้าสู่ทางพิเศษยกระดับบูรพาวิถีมุ่งหน้าสุวรรณภูมิและชลบุรี',
    color: '#3B82F6',
    plazaIds: ['exat-bang-na-km6', 'exat-at-narong-1'],
  },
  {
    id: 'hub-chaengwatthana',
    name: 'ชุมทางแจ้งวัฒนะ (Chaeng Watthana)',
    lines: ['ทางพิเศษศรีรัช (BEM)', 'ทางพิเศษอุดรรัถยา (BEM)'],
    description: 'จุดต่อขยายจากด่วนศรีรัช สู่ทางพิเศษอุดรรัถยา มุ่งหน้าเมืองทองธานี ปทุมธานี และบางปะอิน',
    color: '#A855F7',
    plazaIds: ['bem-chaeng-watthana-sirat', 'bem-chaeng-watthana'],
  },
  {
    id: 'hub-bangsue',
    name: 'ชุมทางบางซื่อ / จตุจักร (Bang Sue - Chatuchak)',
    lines: ['ทางพิเศษศรีรัช (BEM)', 'ทางพิเศษประจิมรัถยา (BEM)'],
    description: 'จุดเชื่อมต่อด่วนศรีรัช เข้าสู่ทางพิเศษประจิมรัถยา ข้ามแม่น้ำเจ้าพระยาไปฝั่งธนบุรีและกาญจนาภิเษก',
    color: '#EC4899',
    plazaIds: ['bem-kamphaeng-phet', 'bem-kamphaeng-phet-2'],
  },
  {
    id: 'hub-rama9',
    name: 'ชุมทางพระราม 9 (Rama 9 Interchange)',
    lines: ['ทางพิเศษศรีรัช (BEM)', 'ทางพิเศษฉลองรัช (EXAT)'],
    description: 'จุดเชื่อมระหว่างด่วนศรีรัช (ไปสนามบินสุวรรณภูมิ) กับด่วนฉลองรัช (ไปรามอินทรา-วัชรพล)',
    color: '#06B6D4',
    plazaIds: ['bem-rama9', 'exat-rama9-1'],
  },
  {
    id: 'hub-suksawat',
    name: 'ชุมทางสุขสวัสดิ์ - ดาวคะนอง (Suk Sawat - Dao Khanong)',
    lines: ['ทางพิเศษเฉลิมมหานคร (EXAT)', 'ทางพิเศษกาญจนาภิเษกใต้ (EXAT/DOH)'],
    description: 'จุดเชื่อมต่อด่วนเฉลิมมหานคร เข้าสู่วงแหวนอุตสาหกรรมและกาญจนาภิเษกบางพลี-สุขสวัสดิ์',
    color: '#10B981',
    plazaIds: ['exat-dao-khanong', 'exat-suksawat'],
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
  const [expandedLine, setExpandedLine] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<TollPlaza | null>(null);

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
        g.plazas.some((p) => p.name_th.toLowerCase().includes(lower) || p.name_en.toLowerCase().includes(lower))
      );
    });
  }, [lineGroups, selectedOperator, searchTerm]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/70 to-indigo-950/80 border border-blue-500/30 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-blue-400">
              <GitFork className="w-4 h-4" />
              <span>CarToll Network & Topology Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">
              โครงข่ายสายทางด่วนและผังเชื่อมต่อ (Toll Lines & Network Graph)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light leading-relaxed">
              สำรวจรายชื่อสายทางด่วนและมอเตอร์เวย์ทั้งหมดในประเทศไทย พร้อมผังความสัมพันธ์จุดเชื่อมต่อข้ามระบบ (Interchanges)
              ระหว่าง 4 ผู้ให้บริการ: กทพ. (EXAT), BEM, โทลล์เวย์ (DMT), และกรมทางหลวง (DOH)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center flex-shrink-0">
            <div>
              <div className="text-xl font-bold text-blue-400">{lineGroups.length}</div>
              <div className="text-[10px] text-slate-400 uppercase">สายทางด่วน</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">{plazas.length}</div>
              <div className="text-[10px] text-slate-400 uppercase">ด่านจัดเก็บ</div>
            </div>
            <div>
              <div className="text-xl font-bold text-amber-400">{INTERCHANGE_HUBS.length}</div>
              <div className="text-[10px] text-slate-400 uppercase">จุดเชื่อมข้ามสาย</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Major Interchanges Topological Visual Graph */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <GitFork className="w-5 h-5 text-blue-400" />
              <span>จุดเชื่อมต่อและชุมทางข้ามระบบหลัก (Key Interchange Hubs)</span>
            </h3>
            <p className="text-xs text-slate-400 font-light">
              จุดตัดและสะพานเชื่อมข้ามระหว่างสายทางด่วนต่างๆ ที่รองรับการเดินทางต่อเนื่องข้ามเครือข่าย
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            {INTERCHANGE_HUBS.length} ชุมทางเชื่อมต่อ
          </span>
        </div>

        {/* Interchange Hubs Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTERCHANGE_HUBS.map((hub) => (
            <div
              key={hub.id}
              className="glass-card p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-3 shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse"
                    style={{ backgroundColor: hub.color }}
                  />
                  <h4 className="font-bold text-sm text-white">{hub.name}</h4>
                </div>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {hub.description}
                </p>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    สายทางที่บรรจบกัน:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {hub.lines.map((l, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-200"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-blue-400 font-medium">
                <span>มีด่านเชื่อมต่อ {hub.plazaIds.length} ด่าน</span>
                <span className="flex items-center gap-1">
                  <span>เลือกคำนวณผ่านชุมทางนี้</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Complete Line Directory with Plaza Sequences */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
        {/* Search & Operator Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Operator Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedOperator('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedOperator === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              ทั้งหมด ({lineGroups.length})
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

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อสายทาง หรือ ด่าน..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
        </div>

        {/* Lines Accordion Cards */}
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const op = OPERATORS[group.operator];
            const isExpanded = expandedLine === group.lineName || (expandedLine === null && filteredGroups.length === 1);

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
                      style={{ backgroundColor: op.color }}
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
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium hidden sm:inline-block ${
                        group.isFlatRate
                          ? 'bg-teal-950/60 text-teal-300 border-teal-500/30'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {group.isFlatRate ? 'อัตราเหมาจ่าย' : 'คิดตามระยะทาง'}
                    </span>

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
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3 transition"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h5 className="font-bold text-sm text-white">{plaza.name_th}</h5>
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
                            <p className="text-xs text-slate-400 font-light mb-2">{plaza.name_en}</p>

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
