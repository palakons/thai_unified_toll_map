export type VehicleClass = 'class_1' | 'class_2' | 'class_3';

export type Operator = 'EXAT' | 'BEM' | 'DMT' | 'DOH';

export type PaymentTag = 'EASY_PASS' | 'M_PASS' | 'M_FLOW' | 'EMV' | 'CASH';

export interface TollPlaza {
  id: string;
  name_th: string;
  name_en: string;
  expressway_line: string;
  operator: Operator;
  coords: [number, number]; // [lat, lng]
  is_entry: boolean;
  is_exit: boolean;
  is_interchange?: boolean;
  payment_methods: PaymentTag[];
}

export interface TollEdge {
  id: string;
  from_plaza_id: string;
  to_plaza_id: string;
  operator: Operator;
  expressway_line: string;
  distance_km: number;
  rates: Record<VehicleClass, number>;
  payment_methods: PaymentTag[];
  official_source_url?: string;
  path_coords?: [number, number][];
  is_transfer?: boolean;
}

export interface RouteLeg {
  id: string;
  operator: Operator;
  expressway_line: string;
  from_plaza: TollPlaza;
  to_plaza: TollPlaza;
  fee: number;
  rates: Record<VehicleClass, number>;
  payment_methods: PaymentTag[];
  official_source_url?: string;
  path_coords: [number, number][];
  is_transfer?: boolean;
}

export interface FareCalculationResult {
  total_fare: number;
  vehicle_class: VehicleClass;
  legs: RouteLeg[];
  total_distance_km: number;
  operators_involved: Operator[];
  compatible_payment_methods: PaymentTag[];
  full_route_coords: [number, number][];
}

export interface PresetRoute {
  id: string;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  origin_id: string;
  destination_id: string;
  icon: string;
  badge?: string;
}
