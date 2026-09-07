import React, { useState } from 'react';
import { FareCalculationResult, VehicleClass } from '../types/toll';
import { OPERATORS } from '../data/tollNetwork';
import { PaymentBadge } from './PaymentBadge';
import { CreditCard, Route, Share2, Check, ExternalLink, FileText, Sparkles } from 'lucide-react';

interface FareBreakdownProps {
  result: FareCalculationResult | null;
  originName?: string;
  destinationName?: string;
  vehicleClass: VehicleClass;
}

export const FareBreakdown: React.FC<FareBreakdownProps> = ({
  result,
  originName,
  destinationName,
  vehicleClass,
}) => {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
          <Route className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-200 text-base">โปรดเลือกจุดขึ้นและจุดลงทางด่วน</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto font-light">
          แตะเลือกหมุดบนแผนที่ หรือค้นหาชื่อด่านจากช่องค้นหาด้านบน เพื่อคำนวณค่าทางด่วนและสรุปยอดค่าบริการรวมพร้อมลิงก์อ้างอิงประกาศทางการ
        </p>
      </div>
    );
  }

  const handleCopySummary = () => {
    const text = `🛣️ สรุปค่าทางด่วน CarToll (ค่าโทลล์)\n📍 จุดขึ้น: ${originName || 'ไม่ระบุ'}\n🏁 จุดลง: ${destinationName || 'ไม่ระบุ'}\n🚗 ประเภทรถ: ${
      vehicleClass === 'class_1' ? 'รถ 4 ล้อ' : vehicleClass === 'class_2' ? 'รถ 6-10 ล้อ' : 'รถ >10 ล้อ'
    }\n💰 ราคารวมทั้งสิ้น: ${result.total_fare} บาท (${result.total_distance_km} กม.)\n💳 ชำระได้ด้วย: ${result.compatible_payment_methods.join(
      ', '
    )}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVehicleLabel = (vc: VehicleClass) => {
    switch (vc) {
      case 'class_1':
        return 'รถ 4 ล้อ (Class 1)';
      case 'class_2':
        return 'รถ 6-10 ล้อ (Class 2)';
      case 'class_3':
        return 'รถมากกว่า 10 ล้อ (Class 3)';
    }
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-5 animate-fade-in">
      {/* Fare Total Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-950/80 via-indigo-950/90 to-purple-950/80 border border-blue-500/30 p-5 text-white shadow-xl">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>ยอดค่าทางด่วนสุทธิ (Total Toll Fee)</span>
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
            {getVehicleLabel(vehicleClass)}
          </span>
        </div>

        <div className="flex items-baseline gap-2 my-1">
          <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300">
            {result.total_fare}
          </span>
          <span className="text-xl font-bold text-blue-200">บาท (THB)</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-blue-500/20">
          <span className="flex items-center gap-1">
            <Route className="w-3.5 h-3.5 text-blue-400" />
            <span>ระยะทางโดยประมาณ: {result.total_distance_km} กม.</span>
          </span>
          <span className="text-slate-400">{result.legs.length} ช่วงด่าน</span>
        </div>
      </div>

      {/* Itemized Leg Breakdown with Official Reference Links */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <span>รายละเอียดค่าบริการแต่ละผู้ให้บริการ</span>
        </h4>

        <div className="space-y-2.5">
          {result.legs.map((leg, index) => {
            const op = OPERATORS[leg.operator];
            const sourceUrl = leg.official_source_url || op.official_source_url;

            return (
              <div
                key={leg.id || index}
                className="glass-card p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-xs font-bold text-slate-400 border border-slate-700">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: op.color }}
                        >
                          {leg.operator}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {leg.expressway_line}
                        </span>
                        {leg.is_transfer && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ทางเชื่อมฟรี (0 บาท)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {leg.from_plaza.name_th} ➔ {leg.to_plaza.name_th}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {leg.is_transfer && leg.fee === 0 ? (
                      <div className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2 py-1 rounded-lg">
                        ฟรี (0 บาท)
                      </div>
                    ) : (
                      <div className="text-base font-bold text-emerald-400">
                        {leg.fee} <span className="text-xs text-slate-400">บาท</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Official Reference Document Link Badge */}
                {sourceUrl && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 hover:underline transition font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>{op.official_doc_name}</span>
                      <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Operators Source References */}
      <div className="space-y-2 pt-3 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>เอกสารอ้างอิงประกาศอัตราค่าผ่านทางทางการ (Official Price References):</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {result.operators_involved.map((opKey) => {
            const op = OPERATORS[opKey];
            return (
              <a
                key={opKey}
                href={op.official_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-blue-500/50 text-xs text-slate-300 hover:text-white transition"
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: op.color }}
                />
                <span>{op.short_name}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Compatible Payment Tag Badges */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
          <span>ช่องทางจ่ายเงินที่รองรับตลอดเส้นทาง:</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {result.compatible_payment_methods.map((method) => (
            <PaymentBadge key={method} method={method} size="md" />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        <button
          onClick={handleCopySummary}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs border border-slate-700 transition"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">คัดลอกสรุปรายการแล้ว!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>คัดลอกสรุปราคาสำหรับแชร์ / ส่งไลน์ (Copy Summary)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
