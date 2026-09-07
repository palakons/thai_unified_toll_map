import { TollPlaza, TollEdge, Operator, PaymentTag, PresetRoute } from '../types/toll';

export interface OperatorInfo {
  code: Operator;
  name_th: string;
  name_en: string;
  short_name: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderHex: string;
  description_th: string;
  official_source_url: string;
  official_doc_name: string;
}

export const OPERATORS: Record<Operator, OperatorInfo> = {
  EXAT: {
    code: 'EXAT',
    name_th: 'การทางพิเศษแห่งประเทศไทย',
    name_en: 'Expressway Authority of Thailand (EXAT)',
    short_name: 'EXAT / กทพ.',
    color: '#2563EB',
    badgeBg: 'bg-blue-900/60 text-blue-200 border-blue-600/50',
    badgeText: 'text-blue-400',
    borderHex: '#3B82F6',
    description_th: 'ทางพิเศษเฉลิมมหานคร, ฉลองรัช, บูรพาวิถี, กาญจนาภิเษก (บางพลี-สุขสวัสดิ์), สาย S1',
    official_source_url: 'https://www.exat.co.th/toll-rate/',
    official_doc_name: 'ประกาศอัตราค่าผ่านทางทางการ กทพ. (EXAT Tariff)',
  },
  BEM: {
    code: 'BEM',
    name_th: 'บริษัท ทางด่วนและรถไฟฟ้ากรุงเทพ จำกัด (มหาชน)',
    name_en: 'Bangkok Expressway and Metro (BEM)',
    short_name: 'BEM / ทางด่วนกรุงเทพ',
    color: '#7C3AED',
    badgeBg: 'bg-purple-900/60 text-purple-200 border-purple-600/50',
    badgeText: 'text-purple-400',
    borderHex: '#8B5CF6',
    description_th: 'ทางพิเศษศรีรัช (ส่วน A/B/C/D), ประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก), อุดรรัถยา (บางปะอิน)',
    official_source_url: 'https://www.bemplc.co.th/Expressway-Service',
    official_doc_name: 'ประกาศอัตราค่าผ่านทางทางการ BEM (BEM Toll Schedule)',
  },
  DMT: {
    code: 'DMT',
    name_th: 'บริษัท ทางยกระดับดอนเมือง จำกัด (มหาชน)',
    name_en: 'Don Muang Tollway PCL (DMT)',
    short_name: 'DMT / โทลล์เวย์',
    color: '#EA580C',
    badgeBg: 'bg-orange-900/60 text-orange-200 border-orange-600/50',
    badgeText: 'text-orange-400',
    borderHex: '#F97316',
    description_th: 'ทางยกระดับอุตราภิมุข (ดินแดง - ดอนเมือง - อนุสรณ์สถาน)',
    official_source_url: 'http://www.tollway.co.th/th/services/toll-rate',
    official_doc_name: 'ประกาศอัตราค่าผ่านทางทางการ โทลล์เวย์ (DMT Official Rates)',
  },
  DOH: {
    code: 'DOH',
    name_th: 'กรมทางหลวง (Department of Highways)',
    name_en: 'Department of Highways (DOH Motorway M6, M7, M9, M81)',
    short_name: 'DOH / มอเตอร์เวย์ M6, M7, M9, M81',
    color: '#059669',
    badgeBg: 'bg-emerald-900/60 text-emerald-200 border-emerald-600/50',
    badgeText: 'text-emerald-400',
    borderHex: '#10B981',
    description_th: 'ทางหลวงพิเศษหมายเลข 7 (ชลบุรี-พัทยา), หมายเลข 9 (วงแหวน M9), หมายเลข 81 (บางใหญ่-กาญจนบุรี), หมายเลข 6 (บางปะอิน-โคราช)',
    official_source_url: 'https://www.motorway.go.th/m-map/',
    official_doc_name: 'ประกาศอัตราค่าธรรมเนียมผ่านทาง กรมทางหลวง (DOH Official Tariff)',
  },
};

export const PAYMENT_TAG_INFO: Record<PaymentTag, { label_th: string; label_en: string; color: string; icon: string }> = {
  EASY_PASS: {
    label_th: 'Easy Pass',
    label_en: 'Easy Pass',
    color: 'bg-blue-600/20 text-blue-300 border-blue-500/40',
    icon: '💳',
  },
  M_PASS: {
    label_th: 'M-Pass',
    label_en: 'M-Pass',
    color: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40',
    icon: '💳',
  },
  M_FLOW: {
    label_th: 'M-Flow',
    label_en: 'M-Flow (ไร้ไม้กั้น)',
    color: 'bg-teal-600/20 text-teal-300 border-teal-500/40',
    icon: '🛣️',
  },
  EMV: {
    label_th: 'EMV Contactless',
    label_en: 'EMV Contactless Credit/Debit',
    color: 'bg-purple-600/20 text-purple-300 border-purple-500/40',
    icon: '📶',
  },
  CASH: {
    label_th: 'เงินสด',
    label_en: 'Cash',
    color: 'bg-amber-600/20 text-amber-300 border-amber-500/40',
    icon: '💵',
  },
};

export const TOLL_PLAZAS: TollPlaza[] = [
  // --- 1. DOH Motorway M9 Eastern & Southern Ring Plazas ---
  {
    id: 'doh-m9-thab-chang-1',
    name_th: 'ด่านทับช้าง 1 (M9 ขาเข้ามุ่งหน้าบางปะอิน กม. 51+445)',
    name_en: 'Thap Chang 1 Toll Plaza (Northbound M9)',
    expressway_line: 'ทางหลวงพิเศษหมายเลข 9 (วงแหวนตะวันออก)',
    operator: 'DOH',
    coords: [13.7380, 100.6930],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_FLOW', 'M_PASS', 'EASY_PASS', 'CASH'],
      entry_rates: { class_1: 30, class_2: 50, class_3: 70 },
  },
  {
    id: 'doh-m9-thab-chang-2',
    name_th: 'ด่านทับช้าง 2 (M9 ขาออกมุ่งหน้าบางนา กม. 49+035)',
    name_en: 'Thap Chang 2 Toll Plaza (Southbound M9)',
    expressway_line: 'ทางหลวงพิเศษหมายเลข 9 (วงแหวนตะวันออก)',
    operator: 'DOH',
    coords: [13.7390, 100.6945],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_FLOW', 'M_PASS', 'EASY_PASS', 'CASH'],
      entry_rates: { class_1: 30, class_2: 50, class_3: 70 },
  },
  {
    id: 'doh-m9-thanyaburi-1',
    name_th: 'ด่านธัญบุรี 1 (M9 ขาเข้ามุ่งหน้าบางปะอิน กม. 25+800)',
    name_en: 'Thanyaburi 1 Toll Plaza (Northbound M9)',
    expressway_line: 'ทางหลวงพิเศษหมายเลข 9 (วงแหวนตะวันออก)',
    operator: 'DOH',
    coords: [13.9780, 100.7090],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_FLOW', 'M_PASS', 'EASY_PASS', 'CASH'],
      entry_rates: { class_1: 30, class_2: 50, class_3: 70 },
  },
  {
    id: 'doh-m9-thanyaburi-2',
    name_th: 'ด่านธัญบุรี 2 (M9 ขาออกมุ่งหน้าบางนา กม. 26+900)',
    name_en: 'Thanyaburi 2 Toll Plaza (Southbound M9)',
    expressway_line: 'ทางหลวงพิเศษหมายเลข 9 (วงแหวนตะวันออก)',
    operator: 'DOH',
    coords: [13.9790, 100.7100],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_FLOW', 'M_PASS', 'EASY_PASS', 'CASH'],
      entry_rates: { class_1: 30, class_2: 50, class_3: 70 },
  },
  {
    id: 'doh-m9-bang-khun-thian',
    name_th: 'ด่านบางขุนเทียน (M9 สุขสวัสดิ์-บางขุนเทียน)',
    name_en: 'Bang Khun Thian Toll Plaza (M9 Southern Ring)',
    expressway_line: 'ทางหลวงพิเศษหมายเลข 9 (ช่วงพระประแดง-บางขุนเทียน)',
    operator: 'DOH',
    coords: [13.6280, 100.4350],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'CASH'],
      entry_rates: { class_1: 15, class_2: 25, class_3: 35 },
  },
  {
    id: 'doh-m9-bang-khru',
    name_th: 'ด่านบางครุ (M9 สุขสวัสดิ์-บางขุนเทียน)',
    name_en: 'Bang Khru Toll Plaza (M9 Southern Ring)',
    expressway_line: 'ทางหลวงพิเศษหมายเลข 9 (ช่วงพระประแดง-บางขุนเทียน)',
    operator: 'DOH',
    coords: [13.6390, 100.5100],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'CASH'],
      entry_rates: { class_1: 15, class_2: 25, class_3: 35 },
  },

  // --- 2. DOH Motorway M7 Official Toll Plazas (1–12) ---
  {
    id: 'doh-m7-lat-krabang',
    name_th: 'ด่านลาดกระบัง (M7 กม. 25+900)',
    name_en: 'Lat Krabang Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7 (กรุงเทพฯ - ชลบุรี - พัทยา - อู่ตะเภา)',
    operator: 'DOH',
    coords: [13.7276, 100.7762],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-bang-bo',
    name_th: 'ด่านบางบ่อ (M7 กม. 40+000)',
    name_en: 'Bang Bo Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [13.6272, 100.8694],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-bang-pakong',
    name_th: 'ด่านบางปะกง (M7 กม. 46+700)',
    name_en: 'Bang Pakong Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [13.5385, 100.9982],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-phanas-nikhom',
    name_th: 'ด่านพนัสนิคม (M7 กม. 65+328)',
    name_en: 'Phanas Nikhom Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [13.4372, 101.0740],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-ban-bueng',
    name_th: 'ด่านบ้านบึง (M7 กม. 72+582)',
    name_en: 'Ban Bueng Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [13.3361, 101.0735],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-bang-phra',
    name_th: 'ด่านบางพระ / ศรีราชา (M7 กม. 78+800)',
    name_en: 'Bang Phra Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [13.2105, 100.9985],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-nong-kham',
    name_th: 'ด่านหนองขาม (M7 กม. 100+500)',
    name_en: 'Nong Kham Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [13.0982, 100.9702],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-pong',
    name_th: 'ด่านโป่ง (M7 กม. 117+075)',
    name_en: 'Pong Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [12.9850, 100.9520],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-pattaya',
    name_th: 'ด่านพัทยา (M7 กม. 122+400)',
    name_en: 'Pattaya Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [12.9420, 100.9380],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-huai-yai',
    name_th: 'ด่านห้วยใหญ่ (M7 กม. 132+100)',
    name_en: 'Huai Yai Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [12.8750, 100.9410],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-khao-chi-on',
    name_th: 'ด่านเขาชีโอน (M7 กม. 143+100)',
    name_en: 'Khao Chi On Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [12.7980, 100.9550],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m7-u-tapao',
    name_th: 'ด่านอู่ตะเภา / มาบตาพุด (M7 กม. 147+050)',
    name_en: 'U-Tapao Toll Plaza (Motorway M7)',
    expressway_line: 'มอเตอร์เวย์สาย 7',
    operator: 'DOH',
    coords: [12.7680, 100.9850],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },

  // --- 3. DOH Motorway M81 (Bang Yai - Kanchanaburi) ---
  {
    id: 'doh-m81-bang-yai',
    name_th: 'ด่านบางใหญ่ (M81 กม. 0+000)',
    name_en: 'Bang Yai Toll Plaza (Motorway M81)',
    expressway_line: 'ทางหลวงพิเศษหมายเลข 81 (บางใหญ่-กาญจนบุรี)',
    operator: 'DOH',
    coords: [13.8760, 100.4100],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m81-nakhon-pathom-west',
    name_th: 'ด่านนครปฐม ตะวันตก (M81 กม. 48+000)',
    name_en: 'Nakhon Pathom West Plaza (M81)',
    expressway_line: 'ทางหลวงพิเศษหมายเลข 81 (บางใหญ่-กาญจนบุรี)',
    operator: 'DOH',
    coords: [13.8300, 100.0000],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },
  {
    id: 'doh-m81-kanchanaburi',
    name_th: 'ด่านกาญจนบุรี (M81 กม. 96+410 ปลายทาง)',
    name_en: 'Kanchanaburi Toll Plaza (M81 Terminal)',
    expressway_line: 'ทางหลวงพิเศษหมายเลข 81 (บางใหญ่-กาญจนบุรี)',
    operator: 'DOH',
    coords: [13.9800, 99.5300],
    is_entry: true,
    is_exit: true,
    payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
  },

  // --- 4. EXAT - Chalerm Maha Nakhon (First Stage Expressway) & S1 ---
  {
    id: 'exat-din-daeng',
    name_th: 'ด่านดินแดง (เฉลิมมหานคร)',
    name_en: 'Din Daeng Toll Plaza (Chalerm Maha Nakhon)',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร (สายดินแดง)',
    operator: 'EXAT',
    coords: [13.7715, 100.5532],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-phetchaburi',
    name_th: 'ด่านเพชรบุรี (เฉลิมมหานคร)',
    name_en: 'Phetchaburi Toll Plaza (Chalerm Maha Nakhon)',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร',
    operator: 'EXAT',
    coords: [13.7500, 100.5500],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-sukhumvit-62',
    name_th: 'ด่านสุขุมวิท 62',
    name_en: 'Sukhumvit 62 Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร (สายบางนา)',
    operator: 'EXAT',
    coords: [13.6920, 100.6020],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-bang-na',
    name_th: 'ด่านบางนา (เฉลิมมหานคร)',
    name_en: 'Bang Na Toll Plaza (Chalerm Maha Nakhon)',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร (สายบางนา)',
    operator: 'EXAT',
    coords: [13.6685, 100.6045],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-at-narong-1',
    name_th: 'ด่านอาจณรงค์ 1 (เฉลิมมหานคร / สาย S1)',
    name_en: 'At Narong 1 Toll Plaza (S1 Connector)',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร / ทางพิเศษสาย S1',
    operator: 'EXAT',
    coords: [13.7080, 100.5840],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-at-narong-2',
    name_th: 'ด่านอาจณรงค์ 2',
    name_en: 'At Narong 2 Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร',
    operator: 'EXAT',
    coords: [13.7090, 100.5850],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-dao-khanong',
    name_th: 'ด่านดาวคะนอง',
    name_en: 'Dao Khanong Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร (สายดาวคะนอง)',
    operator: 'EXAT',
    coords: [13.6930, 100.4850],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-suksawat-exat',
    name_th: 'ด่านสุขสวัสดิ์ (เฉลิมมหานคร)',
    name_en: 'Suksawat Toll Plaza (Chalerm Maha Nakhon)',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร (สายดาวคะนอง)',
    operator: 'EXAT',
    coords: [13.6780, 100.5050],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-rama3',
    name_th: 'ด่านพระราม 3',
    name_en: 'Rama III Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร',
    operator: 'EXAT',
    coords: [13.6950, 100.5280],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-sathu-pradit-1',
    name_th: 'ด่านสาธุประดิษฐ์ 1',
    name_en: 'Sathu Pradit 1 Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร',
    operator: 'EXAT',
    coords: [13.7020, 100.5330],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-sathu-pradit-2',
    name_th: 'ด่านสาธุประดิษฐ์ 2',
    name_en: 'Sathu Pradit 2 Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร',
    operator: 'EXAT',
    coords: [13.7030, 100.5340],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-rama4-1',
    name_th: 'ด่านพระราม 4-1',
    name_en: 'Rama IV-1 Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร',
    operator: 'EXAT',
    coords: [13.7220, 100.5520],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-rama4-2',
    name_th: 'ด่านพระราม 4-2',
    name_en: 'Rama IV-2 Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร',
    operator: 'EXAT',
    coords: [13.7230, 100.5530],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-bon-kai',
    name_th: 'ด่านบ่อนไก่',
    name_en: 'Bon Kai Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร',
    operator: 'EXAT',
    coords: [13.7260, 100.5510],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'exat-port-1',
    name_th: 'ด่านท่าเรือ 1',
    name_en: 'Port 1 Toll Plaza',
    expressway_line: 'ทางพิเศษเฉลิมมหานคร',
    operator: 'EXAT',
    coords: [13.7120, 100.5650],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },

  // --- 5. EXAT - Chalong Rat (Ram Indra - At Narong - Chatu Chot) ---
  {
    id: 'exat-chatu-chot',
    name_th: 'ด่านจตุโชติ (ฉลองรัช)',
    name_en: 'Chatu Chot Toll Plaza (Chalong Rat)',
    expressway_line: 'ทางพิเศษฉลองรัช (รามอินทรา-วงแหวนรอบนอก)',
    operator: 'EXAT',
    coords: [13.8960, 100.6780],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-sukhaphiban-5-1',
    name_th: 'ด่านสุขาภิบาล 5-1 (ฉลองรัช)',
    name_en: 'Sukhaphiban 5-1 Toll Plaza',
    expressway_line: 'ทางพิเศษฉลองรัช',
    operator: 'EXAT',
    coords: [13.8820, 100.6620],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-sukhaphiban-5-2',
    name_th: 'ด่านสุขาภิบาล 5-2 (ฉลองรัช)',
    name_en: 'Sukhaphiban 5-2 Toll Plaza',
    expressway_line: 'ทางพิเศษฉลองรัช',
    operator: 'EXAT',
    coords: [13.8830, 100.6630],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-ram-intra',
    name_th: 'ด่านรามอินทรา (ฉลองรัช)',
    name_en: 'Ram Intra Toll Plaza (Chalong Rat)',
    expressway_line: 'ทางพิเศษฉลองรัช (รามอินทรา-อาจณรงค์)',
    operator: 'EXAT',
    coords: [13.8420, 100.6385],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-yothin-pattana',
    name_th: 'ด่านโยธินพัฒนา',
    name_en: 'Yothin Pattana Toll Plaza',
    expressway_line: 'ทางพิเศษฉลองรัช',
    operator: 'EXAT',
    coords: [13.8050, 100.6180],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-lad-prao',
    name_th: 'ด่านลาดพร้าว (ฉลองรัช)',
    name_en: 'Lad Prao Toll Plaza (Chalong Rat)',
    expressway_line: 'ทางพิเศษฉลองรัช',
    operator: 'EXAT',
    coords: [13.7920, 100.6120],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-pracha-uthit',
    name_th: 'ด่านประชาอุทิศ (ฉลองรัช)',
    name_en: 'Pracha Uthit Toll Plaza (Chalong Rat)',
    expressway_line: 'ทางพิเศษฉลองรัช',
    operator: 'EXAT',
    coords: [13.7740, 100.6020],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-rama9-1',
    name_th: 'ด่านพระราม 9-1 (ฉลองรัช)',
    name_en: 'Rama IX-1 Toll Plaza (Chalong Rat)',
    expressway_line: 'ทางพิเศษฉลองรัช',
    operator: 'EXAT',
    coords: [13.7590, 100.5980],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-rama9-2',
    name_th: 'ด่านพระราม 9-2 (ฉลองรัช)',
    name_en: 'Rama IX-2 Toll Plaza (Chalong Rat)',
    expressway_line: 'ทางพิเศษฉลองรัช',
    operator: 'EXAT',
    coords: [13.7600, 100.5990],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-phatthanakan-1',
    name_th: 'ด่านพัฒนาการ 1 (ฉลองรัช)',
    name_en: 'Phatthanakan 1 Toll Plaza',
    expressway_line: 'ทางพิเศษฉลองรัช',
    operator: 'EXAT',
    coords: [13.7380, 100.5980],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },
  {
    id: 'exat-phra-khanong',
    name_th: 'ด่านพระโขนง',
    name_en: 'Phra Khanong Toll Plaza',
    expressway_line: 'ทางพิเศษฉลองรัช',
    operator: 'EXAT',
    coords: [13.7150, 100.5910],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 70, class_3: 95 },
  },

  // --- 6. EXAT - Burapha Withi (Bang Na - Chon Buri) ---
  {
    id: 'exat-bang-na-km6',
    name_th: 'ด่านบางนา KM.6 (บูรพาวิถี)',
    name_en: 'Bang Na KM.6 Toll Plaza (Burapha Withi)',
    expressway_line: 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)',
    operator: 'EXAT',
    coords: [13.6610, 100.6590],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-bang-kaew',
    name_th: 'ด่านบางแก้ว (บูรพาวิถี)',
    name_en: 'Bang Kaew Toll Plaza (Burapha Withi)',
    expressway_line: 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)',
    operator: 'EXAT',
    coords: [13.6450, 100.6850],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-suvarnabhumi',
    name_th: 'ด่านสุวรรณภูมิ (บูรพาวิถี กม. 15)',
    name_en: 'Suvarnabhumi Toll Plaza (Burapha Withi KM.15)',
    expressway_line: 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)',
    operator: 'EXAT',
    coords: [13.6280, 100.7580],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-bang-sao-thong',
    name_th: 'ด่านบางเสาธง (บูรพาวิถี กม. 26)',
    name_en: 'Bang Sao Thong Toll Plaza (Burapha Withi KM.26)',
    expressway_line: 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)',
    operator: 'EXAT',
    coords: [13.5850, 100.8250],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-bang-bo-burapha',
    name_th: 'ด่านบางบ่อ (บูรพาวิถี กม. 29)',
    name_en: 'Bang Bo Toll Plaza (Burapha Withi KM.29)',
    expressway_line: 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)',
    operator: 'EXAT',
    coords: [13.5550, 100.8720],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-bang-samak',
    name_th: 'ด่านบางสมัคร (บูรพาวิถี กม. 37)',
    name_en: 'Bang Samak Toll Plaza (Burapha Withi KM.37)',
    expressway_line: 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)',
    operator: 'EXAT',
    coords: [13.5280, 100.9150],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-bang-pakong-burapha',
    name_th: 'ด่านบางปะกง (บูรพาวิถี กม. 45)',
    name_en: 'Bang Pakong Toll Plaza (Burapha Withi KM.45)',
    expressway_line: 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)',
    operator: 'EXAT',
    coords: [13.4680, 100.9750],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-chonburi-km55',
    name_th: 'ด่านชลบุรี (บูรพาวิถี กม. 55 - ปลายทางชลบุรี)',
    name_en: 'Chonburi Toll Plaza (Burapha Withi KM.55 Terminal)',
    expressway_line: 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)',
    operator: 'EXAT',
    coords: [13.4110, 100.9980],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },

  // --- 7. EXAT - Kanchanaphisek (Bang Phli - Suk Sawat) ---
  {
    id: 'exat-bang-phli',
    name_th: 'ด่านบางพลี (กาญจนาภิเษก)',
    name_en: 'Bang Phli Toll Plaza (Southern Ring)',
    expressway_line: 'ทางพิเศษกาญจนาภิเษก (บางพลี-สุขสวัสดิ์)',
    operator: 'EXAT',
    coords: [13.6260, 100.7080],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-bang-kaew-ring',
    name_th: 'ด่านบางแก้ว (กาญจนาภิเษก)',
    name_en: 'Bang Kaew Ring Toll Plaza',
    expressway_line: 'ทางพิเศษกาญจนาภิเษก (บางพลี-สุขสวัสดิ์)',
    operator: 'EXAT',
    coords: [13.6400, 100.6820],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-thepharak',
    name_th: 'ด่านเทพารักษ์ (กาญจนาภิเษก)',
    name_en: 'Thepharak Toll Plaza',
    expressway_line: 'ทางพิเศษกาญจนาภิเษก (บางพลี-สุขสวัสดิ์)',
    operator: 'EXAT',
    coords: [13.6190, 100.6120],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-bang-mueang',
    name_th: 'ด่านบางเมือง (กาญจนาภิเษก)',
    name_en: 'Bang Mueang Toll Plaza',
    expressway_line: 'ทางพิเศษกาญจนาภิเษก (บางพลี-สุขสวัสดิ์)',
    operator: 'EXAT',
    coords: [13.6050, 100.6050],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-samut-prakan',
    name_th: 'ด่านสมุทรปราการ (กาญจนาภิเษก)',
    name_en: 'Samut Prakan Toll Plaza',
    expressway_line: 'ทางพิเศษกาญจนาภิเษก (บางพลี-สุขสวัสดิ์)',
    operator: 'EXAT',
    coords: [13.5900, 100.5980],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-poo-chao',
    name_th: 'ด่านปู่เจ้าสมิงพราย (กาญจนาภิเษก)',
    name_en: 'Poo Chao Saming Phrai Toll Plaza',
    expressway_line: 'ทางพิเศษกาญจนาภิเษก (บางพลี-สุขสวัสดิ์)',
    operator: 'EXAT',
    coords: [13.6120, 100.5620],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },
  {
    id: 'exat-suksawat',
    name_th: 'ด่านสุขสวัสดิ์ (กาญจนาภิเษก)',
    name_en: 'Suksawat Toll Plaza (Kanchanaphisek)',
    expressway_line: 'ทางพิเศษกาญจนาภิเษก (บางพลี-สุขสวัสดิ์)',
    operator: 'EXAT',
    coords: [13.6390, 100.5280],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
  },

  // --- 8. BEM - Si Rat Expressway (Sectors A, B, C, D) ---
  {
    id: 'bem-asoke-1',
    name_th: 'ด่านอโศก 1 (ศรีรัช)',
    name_en: 'Asoke 1 Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน A)',
    operator: 'BEM',
    coords: [13.7545, 100.5620],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-asoke-2',
    name_th: 'ด่านอโศก 2 (ศรีรัช)',
    name_en: 'Asoke 2 Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน A)',
    operator: 'BEM',
    coords: [13.7550, 100.5630],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-asoke-3',
    name_th: 'ด่านอโศก 3 (ศรีรัช)',
    name_en: 'Asoke 3 Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน A)',
    operator: 'BEM',
    coords: [13.7540, 100.5610],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 25, class_2: 55, class_3: 75 },
  },
  {
    id: 'bem-asoke-4',
    name_th: 'ด่านอโศก 4 (ศรีรัช)',
    name_en: 'Asoke 4 Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน A)',
    operator: 'BEM',
    coords: [13.7535, 100.5600],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-rama9',
    name_th: 'ด่านพระราม 9 (ศรีรัช)',
    name_en: 'Rama IX Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน A)',
    operator: 'BEM',
    coords: [13.7550, 100.5730],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 25, class_2: 55, class_3: 75 },
  },
  {
    id: 'bem-rama6',
    name_th: 'ด่านพระราม 6 (ศรีรัช)',
    name_en: 'Rama VI Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.7740, 100.5330],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-pracha-chuen',
    name_th: 'ด่านประชาชื่น (ศรีรัช ขาเข้า/ขาออก)',
    name_en: 'Pracha Chuen Toll Plaza (Si Rat Sector C)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน C)',
    operator: 'BEM',
    coords: [13.8290, 100.5360],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-ngam-wong-wan-1',
    name_th: 'ด่านงามวงศ์วาน 1 (ศรีรัช)',
    name_en: 'Ngam Wong Wan 1 Toll Plaza',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน C)',
    operator: 'BEM',
    coords: [13.8580, 100.5370],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 15, class_2: 20, class_3: 35 },
  },
  {
    id: 'bem-ngam-wong-wan-2',
    name_th: 'ด่านงามวงศ์วาน 2 (ศรีรัช)',
    name_en: 'Ngam Wong Wan 2 Toll Plaza',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน C)',
    operator: 'BEM',
    coords: [13.8590, 100.5380],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 15, class_2: 20, class_3: 35 },
  },
  {
    id: 'bem-chaeng-watthana-sirat',
    name_th: 'ด่านแจ้งวัฒนะ (ศรีรัช)',
    name_en: 'Chaeng Watthana Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน C)',
    operator: 'BEM',
    coords: [13.8960, 100.5400],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-song-prapha',
    name_th: 'ด่านสรงประภา (ศรีรัช)',
    name_en: 'Song Prapha Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน C)',
    operator: 'BEM',
    coords: [13.9250, 100.5440],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-yommarat',
    name_th: 'ด่านยมราช (ศรีรัช)',
    name_en: 'Yommarat Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.7570, 100.5210],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-uruphong',
    name_th: 'ด่านอุรุพงษ์ (ศรีรัช)',
    name_en: 'Uruphong Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.7550, 100.5230],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-phahon-yothin-1',
    name_th: 'ด่านพหลโยธิน 1',
    name_en: 'Phahon Yothin 1 Toll Plaza',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.7880, 100.5380],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-phahon-yothin-2',
    name_th: 'ด่านพหลโยธิน 2',
    name_en: 'Phahon Yothin 2 Toll Plaza',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.7890, 100.5390],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-bang-sue-1',
    name_th: 'ด่านบางซื่อ 1 (ศรีรัช)',
    name_en: 'Bang Sue 1 Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.8050, 100.5350],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-bang-sue-2',
    name_th: 'ด่านบางซื่อ 2 (ศรีรัช)',
    name_en: 'Bang Sue 2 Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.8060, 100.5360],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-kamphaeng-phet',
    name_th: 'ด่านกำแพงเพชร (ศรีรัช)',
    name_en: 'Kamphaeng Phet Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.8000, 100.5430],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-ramkhamhaeng',
    name_th: 'ด่านรามคำแหง (ศรีรัช)',
    name_en: 'Ramkhamhaeng Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน D)',
    operator: 'BEM',
    coords: [13.7480, 100.6020],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 25, class_2: 55, class_3: 75 },
  },
  {
    id: 'bem-srinakarin',
    name_th: 'ด่านศรีนครินทร์ (ศรีรัช)',
    name_en: 'Srinakarin Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน D)',
    operator: 'BEM',
    coords: [13.7400, 100.6380],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 25, class_2: 55, class_3: 75 },
  },
  {
    id: 'bem-phatthanakan',
    name_th: 'ด่านพัฒนาการ (ศรีรัช)',
    name_en: 'Phatthanakan Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน D)',
    operator: 'BEM',
    coords: [13.7330, 100.6280],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-surawong',
    name_th: 'ด่านสุรวงศ์ (ศรีรัช)',
    name_en: 'Surawong Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.7290, 100.5240],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },
  {
    id: 'bem-chan',
    name_th: 'ด่านจันทน์ (ศรีรัช)',
    name_en: 'Chan Toll Plaza (Si Rat)',
    expressway_line: 'ทางพิเศษศรีรัช (ส่วน B)',
    operator: 'BEM',
    coords: [13.7120, 100.5260],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 50, class_2: 75, class_3: 110 },
  },

  // --- 9. BEM - Prachim Ratthaya (Si Rat - Outer Ring Road / Chatuchak to Salaya area) ---
  {
    id: 'bem-kamphaeng-phet-2',
    name_th: 'ด่านกำแพงเพชร 2 (จตุจักร / หมอชิต 2)',
    name_en: 'Kamphaeng Phet 2 Toll Plaza (Chatuchak / Mochit 2)',
    expressway_line: 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)',
    operator: 'BEM',
    coords: [13.8080, 100.5480],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 65, class_2: 105, class_3: 150 },
  },
  {
    id: 'bem-rama7',
    name_th: 'ด่านสะพานพระราม 7 (ประจิมรัถยา)',
    name_en: 'Rama VII Bridge Toll Plaza',
    expressway_line: 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)',
    operator: 'BEM',
    coords: [13.8060, 100.5180],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 65, class_2: 105, class_3: 150 },
  },
  {
    id: 'bem-rama6-bang-kruai',
    name_th: 'ด่านพระราม 6 / บางกรวย',
    name_en: 'Rama VI / Bang Kruai Toll Plaza',
    expressway_line: 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)',
    operator: 'BEM',
    coords: [13.8050, 100.5280],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 65, class_2: 105, class_3: 150 },
  },
  {
    id: 'bem-bang-phlat',
    name_th: 'ด่านบางพลัด',
    name_en: 'Bang Phlat Toll Plaza',
    expressway_line: 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)',
    operator: 'BEM',
    coords: [13.7930, 100.4900],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 65, class_2: 105, class_3: 150 },
  },
  {
    id: 'bem-bang-bamru',
    name_th: 'ด่านบางบำหรุ',
    name_en: 'Bang Bamru Toll Plaza',
    expressway_line: 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)',
    operator: 'BEM',
    coords: [13.7840, 100.4700],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 65, class_2: 105, class_3: 150 },
  },
  {
    id: 'bem-borommaratchachonnani',
    name_th: 'ด่านบรมราชชนนี',
    name_en: 'Borommaratchachonnani Toll Plaza',
    expressway_line: 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)',
    operator: 'BEM',
    coords: [13.7800, 100.4550],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 65, class_2: 105, class_3: 150 },
  },
  {
    id: 'bem-taling-chan',
    name_th: 'ด่านตลิ่งชัน',
    name_en: 'Taling Chan Toll Plaza',
    expressway_line: 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)',
    operator: 'BEM',
    coords: [13.7820, 100.4400],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 65, class_2: 105, class_3: 150 },
  },
  {
    id: 'bem-chimphli',
    name_th: 'ด่านฉิมพลี (มุ่งหน้าศาลายา / นครปฐม)',
    name_en: 'Chimphli Toll Plaza (Towards Salaya / Nakhon Pathom)',
    expressway_line: 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)',
    operator: 'BEM',
    coords: [13.7870, 100.4080],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 65, class_2: 105, class_3: 150 },
  },

  // --- 10. BEM - Udon Ratthaya (Chaeng Watthana - Bang Pa-in) ---
  {
    id: 'bem-chaeng-watthana',
    name_th: 'ด่านแจ้งวัฒนะ (อุดรรัถยา)',
    name_en: 'Chaeng Watthana Toll Plaza (Udon Ratthaya)',
    expressway_line: 'ทางพิเศษอุดรรัถยา (แจ้งวัฒนะ-บางปะอิน)',
    operator: 'BEM',
    coords: [13.8980, 100.5420],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 100, class_3: 150 },
  },
  {
    id: 'bem-muang-thong',
    name_th: 'ด่านเมืองทองธานี (อุดรรัถยา)',
    name_en: 'Muang Thong Thani Toll Plaza',
    expressway_line: 'ทางพิเศษอุดรรัถยา (แจ้งวัฒนะ-บางปะอิน)',
    operator: 'BEM',
    coords: [13.9120, 100.5460],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 100, class_3: 150 },
  },
  {
    id: 'bem-sri-samarn',
    name_th: 'ด่านศรีสมาน (อุดรรัถยา)',
    name_en: 'Sri Samarn Toll Plaza',
    expressway_line: 'ทางพิเศษอุดรรัถยา (แจ้งวัฒนะ-บางปะอิน)',
    operator: 'BEM',
    coords: [13.9390, 100.5510],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 100, class_3: 150 },
  },
  {
    id: 'bem-bang-phun',
    name_th: 'ด่านบางพูน (อุดรรัถยา)',
    name_en: 'Bang Phun Toll Plaza',
    expressway_line: 'ทางพิเศษอุดรรัถยา (แจ้งวัฒนะ-บางปะอิน)',
    operator: 'BEM',
    coords: [13.9920, 100.5680],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 100, class_3: 150 },
  },
  {
    id: 'bem-chiang-rak',
    name_th: 'ด่านเชียงราก (ม.ธรรมศาสตร์ ศูนย์รังสิต)',
    name_en: 'Chiang Rak Toll Plaza (Thammasat Rangsit)',
    expressway_line: 'ทางพิเศษอุดรรัถยา (แจ้งวัฒนะ-บางปะอิน)',
    operator: 'BEM',
    coords: [14.0720, 100.6020],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 45, class_2: 100, class_3: 150 },
  },
  {
    id: 'bem-bang-pa-in',
    name_th: 'ด่านบางปะอิน (อุดรรัถยา)',
    name_en: 'Bang Pa-in Toll Plaza (Udon Ratthaya)',
    expressway_line: 'ทางพิเศษอุดรรัถยา (แจ้งวัฒนะ-บางปะอิน)',
    operator: 'BEM',
    coords: [14.1610, 100.5850],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EASY_PASS', 'EMV', 'CASH'],
      entry_rates: { class_1: 55, class_2: 120, class_3: 180 },
  },

  // --- 11. DMT - Don Mueang Tollway Plazas ---
  {
    id: 'dmt-din-daeng',
    name_th: 'ด่านดินแดง (โทลล์เวย์)',
    name_en: 'Din Daeng Plaza (Don Mueang Tollway)',
    expressway_line: 'ทางยกระดับอุตราภิมุข (ดินแดง-ดอนเมือง)',
    operator: 'DMT',
    coords: [13.7745, 100.5560],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EMV', 'CASH'],
      entry_rates: { class_1: 90, class_2: 120, class_3: 120 },
  },
  {
    id: 'dmt-sutthisan',
    name_th: 'ด่านสุทธิสาร (โทลล์เวย์)',
    name_en: 'Sutthisan Toll Plaza (DMT)',
    expressway_line: 'ทางยกระดับอุตราภิมุข',
    operator: 'DMT',
    coords: [13.7890, 100.5600],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EMV', 'CASH'],
      entry_rates: { class_1: 90, class_2: 120, class_3: 120 },
  },
  {
    id: 'dmt-lad-prao',
    name_th: 'ด่านลาดพร้าว (โทลล์เวย์)',
    name_en: 'Lad Prao Toll Plaza (DMT)',
    expressway_line: 'ทางยกระดับอุตราภิมุข',
    operator: 'DMT',
    coords: [13.8180, 100.5610],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EMV', 'CASH'],
      entry_rates: { class_1: 90, class_2: 120, class_3: 120 },
  },
  {
    id: 'dmt-ratchada',
    name_th: 'ด่านรัชดาภิเษก (โทลล์เวย์)',
    name_en: 'Ratchadaphi Sek Toll Plaza (DMT)',
    expressway_line: 'ทางยกระดับอุตราภิมุข',
    operator: 'DMT',
    coords: [13.8350, 100.5630],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EMV', 'CASH'],
      entry_rates: { class_1: 90, class_2: 120, class_3: 120 },
  },
  {
    id: 'dmt-lak-si',
    name_th: 'ด่านหลักสี่ (โทลล์เวย์)',
    name_en: 'Lak Si Toll Plaza (DMT)',
    expressway_line: 'ทางยกระดับอุตราภิมุข',
    operator: 'DMT',
    coords: [13.8850, 100.5880],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EMV', 'CASH'],
      entry_rates: { class_1: 40, class_2: 50, class_3: 50 },
  },
  {
    id: 'dmt-don-mueang',
    name_th: 'ด่านสนามบินดอนเมือง (โทลล์เวย์)',
    name_en: 'Don Mueang Airport Plaza (DMT)',
    expressway_line: 'ทางยกระดับอุตราภิมุข',
    operator: 'DMT',
    coords: [13.9110, 100.6020],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EMV', 'CASH'],
      entry_rates: { class_1: 40, class_2: 50, class_3: 50 },
  },
  {
    id: 'dmt-anusorn-sit',
    name_th: 'ด่านอนุสรณ์สถาน (โทลล์เวย์)',
    name_en: 'Anusorn Sit Toll Plaza (DMT)',
    expressway_line: 'ทางยกระดับอุตราภิมุข (ช่วงดอนเมือง-อนุสรณ์สถาน)',
    operator: 'DMT',
    coords: [13.9550, 100.6180],
    is_entry: true,
    is_exit: true,
    payment_methods: ['EMV', 'CASH'],
      entry_rates: { class_1: 40, class_2: 50, class_3: 50 },
  },
];

// Complete Official M7 Matrix (1–12)
const M7_COMPLETE_MATRIX: Record<string, Record<string, [number, number, number]>> = {
  'doh-m7-lat-krabang': {
    'doh-m7-bang-bo': [25, 45, 60],
    'doh-m7-bang-pakong': [30, 45, 70],
    'doh-m7-phanas-nikhom': [45, 75, 110],
    'doh-m7-ban-bueng': [55, 90, 130],
    'doh-m7-bang-phra': [60, 100, 140],
    'doh-m7-nong-kham': [80, 130, 190],
    'doh-m7-pong': [100, 160, 235],
    'doh-m7-pattaya': [105, 170, 245],
    'doh-m7-huai-yai': [115, 185, 265],
    'doh-m7-khao-chi-on': [125, 200, 290],
    'doh-m7-u-tapao': [130, 210, 305],
  },
  'doh-m7-bang-bo': {
    'doh-m7-bang-pakong': [10, 15, 20],
    'doh-m7-phanas-nikhom': [25, 45, 65],
    'doh-m7-ban-bueng': [35, 55, 80],
    'doh-m7-bang-phra': [40, 65, 95],
    'doh-m7-nong-kham': [60, 100, 145],
    'doh-m7-pong': [80, 130, 190],
    'doh-m7-pattaya': [85, 135, 195],
    'doh-m7-huai-yai': [95, 150, 220],
    'doh-m7-khao-chi-on': [105, 170, 245],
    'doh-m7-u-tapao': [110, 180, 260],
  },
  'doh-m7-bang-pakong': {
    'doh-m7-phanas-nikhom': [15, 25, 40],
    'doh-m7-ban-bueng': [25, 40, 55],
    'doh-m7-bang-phra': [30, 50, 70],
    'doh-m7-nong-kham': [50, 80, 120],
    'doh-m7-pong': [70, 115, 165],
    'doh-m7-pattaya': [75, 120, 170],
    'doh-m7-huai-yai': [85, 135, 195],
    'doh-m7-khao-chi-on': [95, 150, 220],
    'doh-m7-u-tapao': [100, 160, 235],
  },
  'doh-m7-phanas-nikhom': {
    'doh-m7-ban-bueng': [10, 15, 20],
    'doh-m7-bang-phra': [10, 20, 30],
    'doh-m7-nong-kham': [30, 50, 75],
    'doh-m7-pong': [50, 85, 120],
    'doh-m7-pattaya': [55, 90, 130],
    'doh-m7-huai-yai': [65, 105, 150],
    'doh-m7-khao-chi-on': [75, 120, 175],
    'doh-m7-u-tapao': [80, 130, 190],
  },
  'doh-m7-ban-bueng': {
    'doh-m7-bang-phra': [10, 15, 20],
    'doh-m7-nong-kham': [25, 40, 60],
    'doh-m7-pong': [45, 70, 105],
    'doh-m7-pattaya': [45, 75, 110],
    'doh-m7-huai-yai': [55, 95, 135],
    'doh-m7-khao-chi-on': [65, 105, 150],
    'doh-m7-u-tapao': [75, 120, 175],
  },
  'doh-m7-bang-phra': {
    'doh-m7-nong-kham': [15, 25, 40],
    'doh-m7-pong': [40, 60, 90],
    'doh-m7-pattaya': [40, 65, 100],
    'doh-m7-huai-yai': [50, 85, 120],
    'doh-m7-khao-chi-on': [60, 100, 145],
    'doh-m7-u-tapao': [70, 110, 160],
  },
  'doh-m7-nong-kham': {
    'doh-m7-pong': [15, 30, 40],
    'doh-m7-pattaya': [15, 30, 40],
    'doh-m7-huai-yai': [30, 50, 70],
    'doh-m7-khao-chi-on': [40, 65, 100],
    'doh-m7-u-tapao': [45, 75, 110],
  },
  'doh-m7-pong': {
    'doh-m7-pattaya': [10, 15, 20],
    'doh-m7-huai-yai': [20, 35, 55],
    'doh-m7-khao-chi-on': [30, 45, 65],
    'doh-m7-u-tapao': [35, 55, 80],
  },
  'doh-m7-pattaya': {
    'doh-m7-huai-yai': [10, 20, 25],
    'doh-m7-khao-chi-on': [20, 35, 55],
    'doh-m7-u-tapao': [30, 50, 75],
  },
  'doh-m7-huai-yai': {
    'doh-m7-khao-chi-on': [10, 20, 25],
    'doh-m7-u-tapao': [15, 25, 35],
  },
  'doh-m7-khao-chi-on': {
    'doh-m7-u-tapao': [10, 15, 20],
  },
};

function generateM7Edges(): TollEdge[] {
  const edges: TollEdge[] = [];
  const plazaMap = new Map(TOLL_PLAZAS.map((p) => [p.id, p]));

  for (const fromId in M7_COMPLETE_MATRIX) {
    const fromP = plazaMap.get(fromId);
    if (!fromP) continue;

    for (const toId in M7_COMPLETE_MATRIX[fromId]) {
      const toP = plazaMap.get(toId);
      if (!toP) continue;

      const [c1, c2, c3] = M7_COMPLETE_MATRIX[fromId][toId];
      const latDiff = toP.coords[0] - fromP.coords[0];
      const lngDiff = toP.coords[1] - fromP.coords[1];
      const dist = Math.round(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111 * 10) / 10;

      edges.push({
        id: `edge-m7-${fromId}-${toId}`,
        from_plaza_id: fromId,
        to_plaza_id: toId,
        operator: 'DOH',
        expressway_line: 'มอเตอร์เวย์สาย 7 (กรุงเทพฯ-พัทยา-อู่ตะเภา)',
        distance_km: dist,
        rates: { class_1: c1, class_2: c2, class_3: c3 },
        payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
        official_source_url: OPERATORS.DOH.official_source_url,
        path_coords: [fromP.coords, toP.coords],
      });

      edges.push({
        id: `edge-m7-${toId}-${fromId}`,
        from_plaza_id: toId,
        to_plaza_id: fromId,
        operator: 'DOH',
        expressway_line: 'มอเตอร์เวย์สาย 7 (กรุงเทพฯ-พัทยา-อู่ตะเภา)',
        distance_km: dist,
        rates: { class_1: c1, class_2: c2, class_3: c3 },
        payment_methods: ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH'],
        official_source_url: OPERATORS.DOH.official_source_url,
        path_coords: [toP.coords, fromP.coords],
      });
    }
  }

  return edges;
}

function generateAllPairwiseEdges(): TollEdge[] {
  const edges: TollEdge[] = [];
  const plazaMap = new Map(TOLL_PLAZAS.map((p) => [p.id, p]));

  const addE = (
    edgeId: string,
    fromId: string,
    toId: string,
    lineName: string,
    distKm: number,
    c1: number,
    c2: number,
    c3: number,
    methods: PaymentTag[] = ['EASY_PASS', 'EMV', 'CASH']
  ) => {
    const fromP = plazaMap.get(fromId);
    const toP = plazaMap.get(toId);
    if (!fromP || !toP) return;

    edges.push({
      id: edgeId,
      from_plaza_id: fromId,
      to_plaza_id: toId,
      operator: fromP.operator,
      expressway_line: lineName,
      distance_km: distKm,
      rates: { class_1: c1, class_2: c2, class_3: c3 },
      payment_methods: methods,
      official_source_url: OPERATORS[fromP.operator]?.official_source_url,
      path_coords: [fromP.coords, toP.coords],
    });
  };

  // 1. Burapha Withi Pairwise Matrix (All 8 Plazas)
  const buraphaKms: Record<string, number> = {
    'exat-bang-na-km6': 6.0,
    'exat-bang-kaew': 9.5,
    'exat-suvarnabhumi': 15.0,
    'exat-bang-sao-thong': 26.0,
    'exat-bang-bo-burapha': 29.0,
    'exat-bang-samak': 37.0,
    'exat-bang-pakong-burapha': 45.0,
    'exat-chonburi-km55': 55.0,
  };
  const buraphaKeys = Object.keys(buraphaKms);

  for (let i = 0; i < buraphaKeys.length; i++) {
    for (let j = i + 1; j < buraphaKeys.length; j++) {
      const idA = buraphaKeys[i];
      const idB = buraphaKeys[j];
      const dist = Math.abs(buraphaKms[idB] - buraphaKms[idA]);
      let c1 = 20, c2 = 40, c3 = 60;

      if (dist <= 10) { c1 = 20; c2 = 40; c3 = 60; }
      else if (dist <= 20) { c1 = 25; c2 = 50; c3 = 75; }
      else if (dist <= 30) { c1 = 40; c2 = 80; c3 = 120; }
      else if (dist <= 40) { c1 = 55; c2 = 110; c3 = 165; }
      else if (dist <= 48) { c1 = 65; c2 = 130; c3 = 195; }
      else { c1 = 70; c2 = 145; c3 = 220; }

      addE(`edge-burapha-${idA}-${idB}`, idA, idB, 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)', dist, c1, c2, c3);
      addE(`edge-burapha-${idB}-${idA}`, idB, idA, 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี)', dist, c1, c2, c3);
    }
  }

  // 2. Chalerm Maha Nakhon Pairwise Matrix (50 THB Flat)
  const cmnIds = TOLL_PLAZAS.filter((p) => p.operator === 'EXAT' && p.expressway_line.includes('เฉลิมมหานคร')).map((p) => p.id);
  for (let i = 0; i < cmnIds.length; i++) {
    for (let j = i + 1; j < cmnIds.length; j++) {
      const idA = cmnIds[i];
      const idB = cmnIds[j];
      const pA = plazaMap.get(idA)!;
      const pB = plazaMap.get(idB)!;
      const latD = pB.coords[0] - pA.coords[0];
      const lngD = pB.coords[1] - pA.coords[1];
      const dist = Math.round(Math.sqrt(latD * latD + lngD * lngD) * 111 * 10) / 10;
      addE(`edge-cmn-${idA}-${idB}`, idA, idB, 'ทางพิเศษเฉลิมมหานคร', dist, 50, 75, 110);
      addE(`edge-cmn-${idB}-${idA}`, idB, idA, 'ทางพิเศษเฉลิมมหานคร', dist, 50, 75, 110);
    }
  }

  // 3. Si Rat Pairwise Matrix (50 THB Flat)
  const siratIds = TOLL_PLAZAS.filter((p) => p.operator === 'BEM' && p.expressway_line.includes('ศรีรัช')).map((p) => p.id);
  for (let i = 0; i < siratIds.length; i++) {
    for (let j = i + 1; j < siratIds.length; j++) {
      const idA = siratIds[i];
      const idB = siratIds[j];
      const pA = plazaMap.get(idA)!;
      const pB = plazaMap.get(idB)!;
      const latD = pB.coords[0] - pA.coords[0];
      const lngD = pB.coords[1] - pA.coords[1];
      const dist = Math.round(Math.sqrt(latD * latD + lngD * lngD) * 111 * 10) / 10;
      addE(`edge-sirat-${idA}-${idB}`, idA, idB, 'ทางพิเศษศรีรัช', dist, 50, 75, 110);
      addE(`edge-sirat-${idB}-${idA}`, idB, idA, 'ทางพิเศษศรีรัช', dist, 50, 75, 110);
    }
  }

  // 4. Prachim Ratthaya Pairwise Matrix (65 THB Flat)
  const prachimIds = TOLL_PLAZAS.filter((p) => p.expressway_line.includes('ประจิมรัถยา')).map((p) => p.id);
  for (let i = 0; i < prachimIds.length; i++) {
    for (let j = i + 1; j < prachimIds.length; j++) {
      const idA = prachimIds[i];
      const idB = prachimIds[j];
      const pA = plazaMap.get(idA)!;
      const pB = plazaMap.get(idB)!;
      const latD = pB.coords[0] - pA.coords[0];
      const lngD = pB.coords[1] - pA.coords[1];
      const dist = Math.round(Math.sqrt(latD * latD + lngD * lngD) * 111 * 10) / 10;
      addE(`edge-prachim-${idA}-${idB}`, idA, idB, 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)', dist, 65, 105, 150);
      addE(`edge-prachim-${idB}-${idA}`, idB, idA, 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก)', dist, 65, 105, 150);
    }
  }

  // 5. Chalong Rat Pairwise Matrix (45 THB Flat)
  const chalongIds = TOLL_PLAZAS.filter((p) => p.expressway_line.includes('ฉลองรัช')).map((p) => p.id);
  for (let i = 0; i < chalongIds.length; i++) {
    for (let j = i + 1; j < chalongIds.length; j++) {
      const idA = chalongIds[i];
      const idB = chalongIds[j];
      const pA = plazaMap.get(idA)!;
      const pB = plazaMap.get(idB)!;
      const latD = pB.coords[0] - pA.coords[0];
      const lngD = pB.coords[1] - pA.coords[1];
      const dist = Math.round(Math.sqrt(latD * latD + lngD * lngD) * 111 * 10) / 10;
      addE(`edge-chalong-${idA}-${idB}`, idA, idB, 'ทางพิเศษฉลองรัช', dist, 45, 70, 95);
      addE(`edge-chalong-${idB}-${idA}`, idB, idA, 'ทางพิเศษฉลองรัช', dist, 45, 70, 95);
    }
  }

  // 6. Kanchanaphisek Pairwise Matrix
  const kanchanaKms: Record<string, number> = {
    'exat-bang-phli': 0.0,
    'exat-bang-kaew-ring': 3.0,
    'exat-thepharak': 9.0,
    'exat-bang-mueang': 11.5,
    'exat-samut-prakan': 13.0,
    'exat-poo-chao': 16.5,
    'exat-suksawat': 22.5,
    'doh-m9-bang-khun-thian': 34.0,
  };
  const kanchanaKeys = Object.keys(kanchanaKms);
  for (let i = 0; i < kanchanaKeys.length; i++) {
    for (let j = i + 1; j < kanchanaKeys.length; j++) {
      const idA = kanchanaKeys[i];
      const idB = kanchanaKeys[j];
      const dist = Math.abs(kanchanaKms[idB] - kanchanaKms[idA]);
      let c1 = 15, c2 = 25, c3 = 35;

      if (dist <= 8) { c1 = 15; c2 = 25; c3 = 35; }
      else if (dist <= 15) { c1 = 25; c2 = 45; c3 = 60; }
      else if (dist <= 22) { c1 = 35; c2 = 60; c3 = 85; }
      else { c1 = 40; c2 = 70; c3 = 95; }

      addE(`edge-kanchana-${idA}-${idB}`, idA, idB, 'ทางพิเศษกาญจนาภิเษก (บางพลี-สุขสวัสดิ์)', dist, c1, c2, c3);
      addE(`edge-kanchana-${idB}-${idA}`, idB, idA, 'ทางพิเศษกาญจนาภิเษก (บางพลี-สุขสวัสดิ์)', dist, c1, c2, c3);
    }
  }

  // 7. Udon Ratthaya Pairwise Matrix
  const udonIds = TOLL_PLAZAS.filter((p) => p.expressway_line.includes('อุดรรัถยา')).map((p) => p.id);
  const s1Set = new Set(['bem-chaeng-watthana', 'bem-muang-thong', 'bem-sri-samarn']);
  const s2Set = new Set(['bem-bang-phun', 'bem-chiang-rak', 'bem-bang-pa-in']);

  for (let i = 0; i < udonIds.length; i++) {
    for (let j = i + 1; j < udonIds.length; j++) {
      const idA = udonIds[i];
      const idB = udonIds[j];
      const pA = plazaMap.get(idA)!;
      const pB = plazaMap.get(idB)!;
      const latD = pB.coords[0] - pA.coords[0];
      const lngD = pB.coords[1] - pA.coords[1];
      const dist = Math.round(Math.sqrt(latD * latD + lngD * lngD) * 111 * 10) / 10;
      let c1 = 100, c2 = 220, c3 = 330;

      if (s1Set.has(idA) && s1Set.has(idB)) { c1 = 45; c2 = 100; c3 = 150; }
      else if (s2Set.has(idA) && s2Set.has(idB)) { c1 = 55; c2 = 120; c3 = 180; }

      addE(`edge-udon-${idA}-${idB}`, idA, idB, 'ทางพิเศษอุดรรัถยา (แจ้งวัฒนะ-บางปะอิน)', dist, c1, c2, c3);
      addE(`edge-udon-${idB}-${idA}`, idB, idA, 'ทางพิเศษอุดรรัถยา (แจ้งวัฒนะ-บางปะอิน)', dist, c1, c2, c3);
    }
  }

  // 8. DMT Tollway Pairwise Matrix
  const dmtIds = TOLL_PLAZAS.filter((p) => p.operator === 'DMT').map((p) => p.id);
  const dmtSouth = new Set(['dmt-din-daeng', 'dmt-sutthisan', 'dmt-lad-prao', 'dmt-ratchada']);
  const dmtNorth = new Set(['dmt-lak-si', 'dmt-don-mueang', 'dmt-anusorn-sit']);

  for (let i = 0; i < dmtIds.length; i++) {
    for (let j = i + 1; j < dmtIds.length; j++) {
      const idA = dmtIds[i];
      const idB = dmtIds[j];
      const pA = plazaMap.get(idA)!;
      const pB = plazaMap.get(idB)!;
      const latD = pB.coords[0] - pA.coords[0];
      const lngD = pB.coords[1] - pA.coords[1];
      const dist = Math.round(Math.sqrt(latD * latD + lngD * lngD) * 111 * 10) / 10;
      let c1 = 130, c2 = 170, c3 = 170;

      if (dmtSouth.has(idA) && dmtSouth.has(idB)) { c1 = 90; c2 = 120; c3 = 120; }
      else if (dmtNorth.has(idA) && dmtNorth.has(idB)) { c1 = 40; c2 = 50; c3 = 50; }

      addE(`edge-dmt-${idA}-${idB}`, idA, idB, 'ทางยกระดับอุตราภิมุข', dist, c1, c2, c3, ['EMV', 'CASH']);
      addE(`edge-dmt-${idB}-${idA}`, idB, idA, 'ทางยกระดับอุตราภิมุข', dist, c1, c2, c3, ['EMV', 'CASH']);
    }
  }

  // 9. Motorway M81 Edges
  addE('edge-m81-1-2', 'doh-m81-bang-yai', 'doh-m81-kanchanaburi', 'ทางหลวงพิเศษหมายเลข 81 (บางใหญ่-กาญจนบุรี)', 96.4, 0, 0, 0, ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH']);
  addE('edge-m81-2-1', 'doh-m81-kanchanaburi', 'doh-m81-bang-yai', 'ทางหลวงพิเศษหมายเลข 81 (บางใหญ่-กาญจนบุรี)', 96.4, 0, 0, 0, ['M_PASS', 'EASY_PASS', 'M_FLOW', 'CASH']);

  // 10. Motorway M9 Edges (Full Dual-Direction Matrix for Northbound and Southbound)
  addE('edge-m9-1-2', 'doh-m9-thanyaburi-1', 'doh-m9-thab-chang-1', 'ทางหลวงพิเศษหมายเลข 9 (วงแหวนรอบนอกตะวันออก)', 27.5, 30, 50, 70, ['M_FLOW', 'M_PASS', 'EASY_PASS', 'CASH']);
  addE('edge-m9-2-1', 'doh-m9-thab-chang-1', 'doh-m9-thanyaburi-1', 'ทางหลวงพิเศษหมายเลข 9 (วงแหวนรอบนอกตะวันออก)', 27.5, 30, 50, 70, ['M_FLOW', 'M_PASS', 'EASY_PASS', 'CASH']);
  addE('edge-m9-3-4', 'doh-m9-thanyaburi-2', 'doh-m9-thab-chang-2', 'ทางหลวงพิเศษหมายเลข 9 (วงแหวนรอบนอกตะวันออก)', 27.5, 30, 50, 70, ['M_FLOW', 'M_PASS', 'EASY_PASS', 'CASH']);
  addE('edge-m9-4-3', 'doh-m9-thab-chang-2', 'doh-m9-thanyaburi-2', 'ทางหลวงพิเศษหมายเลข 9 (วงแหวนรอบนอกตะวันออก)', 27.5, 30, 50, 70, ['M_FLOW', 'M_PASS', 'EASY_PASS', 'CASH']);
  addE('edge-m9-5-6', 'doh-m9-bang-khru', 'doh-m9-bang-khun-thian', 'ทางหลวงพิเศษหมายเลข 9 (ช่วงพระประแดง-บางขุนเทียน)', 14.5, 15, 25, 35, ['M_PASS', 'EASY_PASS', 'CASH']);
  addE('edge-m9-6-5', 'doh-m9-bang-khun-thian', 'doh-m9-bang-khru', 'ทางหลวงพิเศษหมายเลข 9 (ช่วงพระประแดง-บางขุนเทียน)', 14.5, 15, 25, 35, ['M_PASS', 'EASY_PASS', 'CASH']);

  // 11. Key Interchange Hub Transfer Ramps (Zero Toll Transfer Ramps)
  // Phaya Thai / Makkasan Interchange (Chalerm Maha Nakhon ↔ Si Rat Urban Network)
  addE('transfer-dindaeng-asoke', 'exat-din-daeng', 'bem-asoke-1', 'ทางเชื่อมต่างระดับมักกะสาน/พญาไท (เฉลิมมหานคร ↔ ศรีรัช)', 3.2, 0, 0, 0);
  addE('transfer-asoke-dindaeng', 'bem-asoke-1', 'exat-din-daeng', 'ทางเชื่อมต่างระดับมักกะสาน/พญาไท (ศรีรัช ↔ เฉลิมมหานคร)', 3.2, 0, 0, 0);

  // Din Daeng Interchange (DMT Don Muang Tollway ↔ Chalerm Maha Nakhon)
  addE('transfer-dmt-exat-dindaeng', 'dmt-din-daeng', 'exat-din-daeng', 'ทางเชื่อมต่างระดับดินแดง (โทลล์เวย์ ↔ เฉลิมมหานคร)', 0.5, 0, 0, 0);
  addE('transfer-exat-dmt-dindaeng', 'exat-din-daeng', 'dmt-din-daeng', 'ทางเชื่อมต่างระดับดินแดง (เฉลิมมหานคร ↔ โทลล์เวย์)', 0.5, 0, 0, 0);

  // S1 Expressway Connector (At Narong ↔ Bang Na Burapha Withi)
  addE('transfer-s1-burapha', 'exat-at-narong-1', 'exat-bang-na-km6', 'ทางเชื่อมต่างระดับบางนา สาย S1 (อาจณรงค์ ↔ บูรพาวิถี)', 4.1, 0, 0, 0);
  addE('transfer-burapha-s1', 'exat-bang-na-km6', 'exat-at-narong-1', 'ทางเชื่อมต่างระดับบางนา สาย S1 (บูรพาวิถี ↔ อาจณรงค์)', 4.1, 0, 0, 0);

  // Bang Sue Interchange (Si Rat ↔ Prachim Ratthaya)
  addE('transfer-sirat-prachim', 'bem-kamphaeng-phet', 'bem-kamphaeng-phet-2', 'ทางเชื่อมต่างระดับบางซื่อ/จตุจักร (ศรีรัช ↔ ประจิมรัถยา)', 1.5, 0, 0, 0);
  addE('transfer-prachim-sirat', 'bem-kamphaeng-phet-2', 'bem-kamphaeng-phet', 'ทางเชื่อมต่างระดับบางซื่อ/จตุจักร (ประจิมรัถยา ↔ ศรีรัช)', 1.5, 0, 0, 0);

  // Chaeng Watthana Interchange (Si Rat ↔ Udon Ratthaya)
  addE('transfer-sirat-udon', 'bem-chaeng-watthana-sirat', 'bem-chaeng-watthana', 'ทางเชื่อมต่างระดับแจ้งวัฒนะ (ศรีรัช ↔ อุดรรัถยา)', 1.2, 0, 0, 0);
  addE('transfer-udon-sirat', 'bem-chaeng-watthana', 'bem-chaeng-watthana-sirat', 'ทางเชื่อมต่างระดับแจ้งวัฒนะ (อุดรรัถยา ↔ ศรีรัช)', 1.2, 0, 0, 0);

  // Rama 9 Interchange (Si Rat ↔ Chalong Rat)
  addE('transfer-sirat-chalong', 'bem-rama9', 'exat-rama9-1', 'ทางเชื่อมต่างระดับพระราม 9 (ศรีรัช ↔ ฉลองรัช)', 2.0, 0, 0, 0);
  addE('transfer-chalong-sirat', 'exat-rama9-1', 'bem-rama9', 'ทางเชื่อมต่างระดับพระราม 9 (ฉลองรัช ↔ ศรีรัช)', 2.0, 0, 0, 0);

  // Bang Khru / Suksawat Interchange (Chalerm Maha Nakhon ↔ Kanchanaphisek)
  addE('transfer-cmn-kanchana', 'exat-dao-khanong', 'exat-suksawat', 'ทางเชื่อมต่างระดับสุขสวัสดิ์/บางครุ (เฉลิมมหานคร ↔ กาญจนาภิเษก)', 3.8, 0, 0, 0);
  addE('transfer-kanchana-cmn', 'exat-suksawat', 'exat-dao-khanong', 'ทางเชื่อมต่างระดับสุขสวัสดิ์/บางครุ (กาญจนาภิเษก ↔ เฉลิมมหานคร)', 3.8, 0, 0, 0);

  // Thap Chang Interchange (Motorway M7 ↔ M9)
  addE('transfer-m7-m9-1', 'doh-m7-lat-krabang', 'doh-m9-thab-chang-1', 'ทางเชื่อมต่างระดับทับช้าง (มอเตอร์เวย์ M7 ↔ M9 เหนือ)', 3.0, 0, 0, 0);
  addE('transfer-m9-m7-1', 'doh-m9-thab-chang-1', 'doh-m7-lat-krabang', 'ทางเชื่อมต่างระดับทับช้าง (มอเตอร์เวย์ M9 เหนือ ↔ M7)', 3.0, 0, 0, 0);
  addE('transfer-m7-m9-2', 'doh-m7-lat-krabang', 'doh-m9-thab-chang-2', 'ทางเชื่อมต่างระดับทับช้าง (มอเตอร์เวย์ M7 ↔ M9 ใต้)', 3.0, 0, 0, 0);
  addE('transfer-m9-m7-2', 'doh-m9-thab-chang-2', 'doh-m7-lat-krabang', 'ทางเชื่อมต่างระดับทับช้าง (มอเตอร์เวย์ M9 ใต้ ↔ M7)', 3.0, 0, 0, 0);

  // Bang Kaew / Bang Phli Interchange (M9 / Burapha Withi / Kanchanaphisek)
  addE('transfer-burapha-kanchana', 'exat-bang-kaew', 'exat-bang-phli', 'ทางเชื่อมต่างระดับบางแก้ว (บูรพาวิถี ↔ กาญจนาภิเษก)', 2.5, 0, 0, 0);
  addE('transfer-kanchana-burapha', 'exat-bang-phli', 'exat-bang-kaew', 'ทางเชื่อมต่างระดับบางแก้ว (กาญจนาภิเษก ↔ บูรพาวิถี)', 2.5, 0, 0, 0);
  addE('transfer-m9-burapha', 'doh-m9-thab-chang-2', 'exat-bang-kaew', 'ทางเชื่อมต่างระดับบางแก้ว (มอเตอร์เวย์ M9 ↔ บูรพาวิถี)', 3.5, 0, 0, 0);
  addE('transfer-burapha-m9', 'exat-bang-kaew', 'doh-m9-thab-chang-1', 'ทางเชื่อมต่างระดับบางแก้ว (บูรพาวิถี ↔ มอเตอร์เวย์ M9)', 3.5, 0, 0, 0);
  addE('transfer-m9-kanchana', 'doh-m9-thab-chang-2', 'exat-bang-phli', 'ทางเชื่อมต่างระดับบางพลี (มอเตอร์เวย์ M9 ↔ กาญจนาภิเษก)', 3.5, 0, 0, 0);
  addE('transfer-kanchana-m9', 'exat-bang-phli', 'doh-m9-thab-chang-1', 'ทางเชื่อมต่างระดับบางพลี (กาญจนาภิเษก ↔ มอเตอร์เวย์ M9)', 3.5, 0, 0, 0);

  return edges;
}

export const TOLL_EDGES: TollEdge[] = [
  ...generateM7Edges(),
  ...generateAllPairwiseEdges(),
];

export const PRESET_ROUTES: PresetRoute[] = [
  {
    id: 'survarnabhumi-to-chonburi',
    title_th: '✈️ ด่านสุวรรณภูมิ (บูรพาวิถี) ➔ ด่านชลบุรี (60 บาท)',
    title_en: 'Suvarnabhumi Plaza ➔ Chonburi Terminal (60 THB)',
    description_th: 'ทางพิเศษบูรพาวิถี จากด่านสุวรรณภูมิ (กม.15) ถึง ด่านชลบุรี (กม.55)',
    description_en: 'Burapha Withi Expressway from Suvarnabhumi KM.15 to Chonburi KM.55',
    origin_id: 'exat-suvarnabhumi',
    destination_id: 'exat-chonburi-km55',
    icon: 'plane-takeoff',
    badge: 'บูรพาวิถี (60 บาท)',
  },
  {
    id: 'chatuchak-to-salaya',
    title_th: '🛣️ ด่านกำแพงเพชร 2 (จตุจักร) ➔ ด่านฉิมพลี / ศาลายา (65 บาท)',
    title_en: 'Kamphaeng Phet 2 (Chatuchak) ➔ Chimphli / Salaya (65 THB)',
    description_th: 'ทางพิเศษประจิมรัถยา (ศรีรัช-วงแหวนรอบนอก) อัตราเหมาจ่าย 65 บาท (4 ล้อ)',
    description_en: 'Prachim Ratthaya Expressway - Flat rate 65 THB (Class 1)',
    origin_id: 'bem-kamphaeng-phet-2',
    destination_id: 'bem-chimphli',
    icon: 'route',
    badge: 'ประจิมรัถยา (65 บาท)',
  },
  {
    id: 'm81-bangyai-to-kanchanaburi',
    title_th: '🛣️ มอเตอร์เวย์ M81: ด่านบางใหญ่ ➔ ด่านกาญจนบุรี (ทดลองวิ่งฟรี)',
    title_en: 'Motorway M81: Bang Yai ➔ Kanchanaburi (Free Trial)',
    description_th: 'ทางหลวงพิเศษหมายเลข 81 (บางใหญ่-นครปฐม-กาญจนบุรี 96.4 กม.)',
    description_en: 'Motorway M81 (Bang Yai - Nakhon Pathom - Kanchanaburi 96.4 km)',
    origin_id: 'doh-m81-bang-yai',
    destination_id: 'doh-m81-kanchanaburi',
    icon: 'route',
    badge: 'M81 กาญจนบุรี',
  },
  {
    id: 'bangna-to-chonburi-burapha',
    title_th: '🛣️ ด่านบางนา KM.6 ➔ ด่านชลบุรี (บูรพาวิถี 70 บาท)',
    title_en: 'Bang Na KM.6 ➔ Chonburi (Burapha Withi 70 THB)',
    description_th: 'ทางพิเศษบูรพาวิถี (ยกระดับบางนา-ชลบุรี) 70 บาท (4 ล้อ)',
    description_en: 'Burapha Withi Expressway - Full length Bang Na to Chonburi (70 THB)',
    origin_id: 'exat-bang-na-km6',
    destination_id: 'exat-chonburi-km55',
    icon: 'route',
    badge: 'บูรพาวิถี (70 บาท)',
  },
  {
    id: 'latkrabang-to-utapao',
    title_th: '✈️ ด่านลาดกระบัง (M7) ➔ ด่านอู่ตะเภา / ระยอง (130 บาท)',
    title_en: 'Lat Krabang M7 ➔ U-Tapao / Map Ta Phut (130 THB)',
    description_th: 'มอเตอร์เวย์สาย 7 สุดสาย กรุงเทพฯ ถึง สนามบินอู่ตะเภา / มาบตาพุด',
    description_en: 'Motorway M7 full length to U-Tapao Airport (130 THB Class 1)',
    origin_id: 'doh-m7-lat-krabang',
    destination_id: 'doh-m7-u-tapao',
    icon: 'plane-takeoff',
    badge: 'M7 สุดสายอู่ตะเภา',
  },
  {
    id: 'm9-thanyaburi-to-thapchang',
    title_th: '🛣️ มอเตอร์เวย์ M9: ด่านธัญบุรี ➔ ด่านทับช้าง (30 บาท/ด่าน)',
    title_en: 'Motorway M9: Thanyaburi ➔ Thap Chang (30 THB/plaza)',
    description_th: 'วงแหวนรอบนอกตะวันออก (M9) - ระบบ M-Flow ไร้ไม้กั้น 30 บาท (4 ล้อ)',
    description_en: 'Eastern Outer Ring Road (M9) - M-Flow system 30 THB per plaza',
    origin_id: 'doh-m9-thanyaburi-1',
    destination_id: 'doh-m9-thab-chang-1',
    icon: 'route',
    badge: 'M9 M-Flow (30 บาท)',
  },
  {
    id: 'chaengwatthana-to-thammasat',
    title_th: '🏫 ด่านแจ้งวัฒนะ ➔ ด่านเชียงราก / ม.ธรรมศาสตร์ (85 บาท)',
    title_en: 'Chaeng Watthana ➔ Chiang Rak / Thammasat U. (85 THB)',
    description_th: 'ทางพิเศษอุดรรัถยา (ด่านแจ้งวัฒนะ ถึง เชียงราก ธรรมศาสตร์รังสิต)',
    description_en: 'Udon Ratthaya Expressway - Chaeng Watthana to Thammasat Rangsit',
    origin_id: 'bem-chaeng-watthana',
    destination_id: 'bem-chiang-rak',
    icon: 'route',
    badge: 'อุดรรัถยา (85 บาท)',
  },
  {
    id: 'donmueang-to-silom',
    title_th: '✈️ สนามบินดอนเมือง ➔ สีลม / สาทร',
    title_en: 'Don Mueang Airport ➔ Silom / Sathorn',
    description_th: 'ด่านดอนเมือง (DMT) -> ด่านดินแดง -> ทางพิเศษเฉลิมมหานคร',
    description_en: 'Don Mueang Plaza (DMT) -> Din Daeng -> Chalerm Maha Nakhon',
    origin_id: 'dmt-don-mueang',
    destination_id: 'exat-din-daeng',
    icon: 'plane-takeoff',
    badge: 'เส้นทางยอดนิยม',
  },
];
