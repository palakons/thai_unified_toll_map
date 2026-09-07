import React, { useState } from 'react';
import { TollPlaza, TollEdge, Operator } from '../types/toll';
import { OPERATORS } from '../data/tollNetwork';
import { MapView } from './MapView';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Download,
  Search,
  Check,
  X,
  Database,
  Map,
  List,
  MousePointer,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  plazas: TollPlaza[];
  edges: TollEdge[];
  onUpdatePlazas: (plazas: TollPlaza[]) => void;
  onUpdateEdges: (edges: TollEdge[]) => void;
  onResetToDefault: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  plazas,
  edges,
  onUpdatePlazas,
  onUpdateEdges,
  onResetToDefault,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlazaId, setEditingPlazaId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TollPlaza>>({
    name_th: '',
    name_en: '',
    expressway_line: '',
    operator: 'DOH',
    coords: [13.7563, 100.5018],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'CASH'],
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const filteredPlazas = plazas.filter(
    (p) =>
      p.name_th.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.expressway_line.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.operator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddForm = (initialCoords?: [number, number]) => {
    setEditingPlazaId(null);
    setFormData({
      id: `plaza-${Date.now()}`,
      name_th: '',
      name_en: '',
      expressway_line: 'มอเตอร์เวย์สาย 7',
      operator: 'DOH',
      coords: initialCoords || [13.7563, 100.5018],
      is_entry: true,
      is_exit: true,
      payment_methods: ['EASY_PASS', 'CASH'],
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (plaza: TollPlaza) => {
    setEditingPlazaId(plaza.id);
    setFormData({ ...plaza });
    setIsFormOpen(true);
  };

  // Mouse Drag Handler on Map
  const handleDragPlazaOnMap = (plazaId: string, newCoords: [number, number]) => {
    const targetPlaza = plazas.find((p) => p.id === plazaId);
    if (!targetPlaza) return;

    const updated = plazas.map((p) => (p.id === plazaId ? { ...p, coords: newCoords } : p));
    onUpdatePlazas(updated);

    showToast(`📍 ปรับพิกัด ${targetPlaza.name_th}: [${newCoords[0].toFixed(5)}, ${newCoords[1].toFixed(5)}]`);
  };

  // Map Click Handler to Create Plaza
  const handleMapClickAdd = (coords: [number, number]) => {
    handleOpenAddForm(coords);
    showToast(`📍 เลือกตำแหน่งพิกัด: [${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}]`);
  };

  const handleSavePlaza = () => {
    if (!formData.name_th || !formData.name_en) return;

    if (editingPlazaId) {
      const updated = plazas.map((p) => (p.id === editingPlazaId ? ({ ...p, ...formData } as TollPlaza) : p));
      onUpdatePlazas(updated);
      showToast(`บันทึกข้อมูลด่าน ${formData.name_th} เรียบร้อยแล้ว`);
    } else {
      const newPlaza: TollPlaza = {
        id: formData.id || `plaza-${Date.now()}`,
        name_th: formData.name_th || '',
        name_en: formData.name_en || '',
        expressway_line: formData.expressway_line || 'ทางพิเศษ',
        operator: formData.operator || 'DOH',
        coords: formData.coords || [13.7563, 100.5018],
        is_entry: formData.is_entry ?? true,
        is_exit: formData.is_exit ?? true,
        payment_methods: formData.payment_methods || ['EASY_PASS', 'CASH'],
      };
      onUpdatePlazas([...plazas, newPlaza]);
      showToast(`สร้างด่านใหม่ ${newPlaza.name_th} เรียบร้อยแล้ว`);
    }

    setIsFormOpen(false);
  };

  const handleDeletePlaza = (id: string) => {
    if (confirm('คุณต้องการลบด่านนี้ใช่หรือไม่?')) {
      const target = plazas.find((p) => p.id === id);
      onUpdatePlazas(plazas.filter((p) => p.id !== id));
      onUpdateEdges(edges.filter((e) => e.from_plaza_id !== id && e.to_plaza_id !== id));
      showToast(`ลบด่าน ${target?.name_th || ''} เรียบร้อยแล้ว`);
    }
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ plazas, edges }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `toll_network_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden animate-fade-in">
      {/* Admin Top Navigation Bar */}
      <div className="glass-panel border-b border-slate-800 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <span>Admin: ปรับตำแหน่งพิกัดด่านด้วยเมาส์ (Mouse Map Editor)</span>
            </h2>
            <p className="text-xs text-slate-400 font-light">
              ลากหมุดด่านบนแผนที่เพื่อย้ายพิกัด หรือ คลิกพื้นที่บนแผนที่เพื่อสร้างด่านใหม่ทันที
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{saveToast}</span>
            </span>
          )}

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'map'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>แผนที่ปรับพิกัดด้วยเมาส์</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>ตารางข้อมูล</span>
            </button>
          </div>

          <button
            onClick={onResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-medium border border-blue-700/50 transition"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>ส่งออก JSON</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="flex-1 overflow-hidden p-4 sm:p-6 flex flex-col space-y-4">
        {/* Mouse Map Editor View Mode */}
        {viewMode === 'map' ? (
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-amber-500/30">
            <MapView
              plazas={plazas}
              isAdminMode={true}
              onDragPlaza={handleDragPlazaOnMap}
              onMapClickAdd={handleMapClickAdd}
              onEditPlaza={handleOpenEditForm}
            />

            {/* Instruction Overlay */}
            <div className="absolute top-4 right-4 z-[400] glass-panel p-3 rounded-xl max-w-xs text-xs text-slate-300 space-y-1.5 border border-amber-500/30">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>วิธีปรับพิกัดด่านด้วยเมาส์:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 font-light">
                <li><strong className="text-white">ลากหมุดด่าน:</strong> คลิกค้างที่หมุดแล้วลากเพื่อเปลี่ยนตำแหน่งพิกัด GPS</li>
                <li><strong className="text-white">คลิกบนแผนที่:</strong> คลิกจุดใดก็ได้เพื่อปักหมุดและสร้างด่านใหม่</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Table View Mode */
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาด่าน..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <button
                onClick={() => handleOpenAddForm()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มด่านใหม่</span>
              </button>
            </div>

            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">ผู้ให้บริการ</th>
                    <th className="py-3.5 px-4">ชื่อด่าน (TH / EN)</th>
                    <th className="py-3.5 px-4">สายทาง</th>
                    <th className="py-3.5 px-4">พิกัด GPS (Lat, Lng)</th>
                    <th className="py-3.5 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPlazas.map((plaza) => {
                    const op = OPERATORS[plaza.operator];
                    return (
                      <tr key={plaza.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                            style={{ backgroundColor: op.color }}
                          >
                            {plaza.operator}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{plaza.name_th}</div>
                          <div className="text-[11px] text-slate-400 font-light">{plaza.name_en}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-light">{plaza.expressway_line}</td>
                        <td className="py-3 px-4 text-emerald-400 font-mono text-[11px]">
                          [{plaza.coords[0].toFixed(5)}, {plaza.coords[1].toFixed(5)}]
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditForm(plaza)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePlaza(plaza.id)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Plaza Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 max-w-lg w-full space-y-4 animate-slide-up shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  <span>{editingPlazaId ? 'แก้ไขข้อมูลด่าน' : 'สร้างด่านใหม่จากตำแหน่งที่เลือก'}</span>
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white text-xs">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">ชื่อด่าน (ภาษาไทย) *</label>
                  <input
                    type="text"
                    value={formData.name_th || ''}
                    onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
                    placeholder="เช่น ด่านบ้านบึง"
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">ชื่อด่าน (ภาษาอังกฤษ) *</label>
                  <input
                    type="text"
                    value={formData.name_en || ''}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="เช่น Ban Bueng Toll Plaza"
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">สายทางด่วน *</label>
                  <input
                    type="text"
                    value={formData.expressway_line || ''}
                    onChange={(e) => setFormData({ ...formData, expressway_line: e.target.value })}
                    placeholder="เช่น มอเตอร์เวย์สาย 7"
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">ผู้ให้บริการ *</label>
                  <select
                    value={formData.operator || 'DOH'}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value as Operator })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    {(Object.keys(OPERATORS) as Operator[]).map((op) => (
                      <option key={op} value={op}>
                        {op} - {OPERATORS[op].name_th}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">พิกัด Latitude *</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={formData.coords?.[0] ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        coords: [isNaN(val) ? 0 : val, formData.coords?.[1] ?? 0],
                      });
                    }}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">พิกัด Longitude *</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={formData.coords?.[1] ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        coords: [formData.coords?.[0] ?? 0, isNaN(val) ? 0 : val],
                      });
                    }}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button onClick={() => setIsFormOpen(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
                  ยกเลิก
                </button>
                <button
                  onClick={handleSavePlaza}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกด่าน</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
