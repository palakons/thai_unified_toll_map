import { TollPlaza, TollEdge, VehicleClass, Operator, PaymentTag, FareCalculationResult, RouteLeg } from '../types/toll';
import { TOLL_PLAZAS, TOLL_EDGES, OPERATORS } from '../data/tollNetwork';

/**
 * Creates a Map of plaza ID to TollPlaza object for O(1) lookup
 */
export function createPlazaMap(plazas: TollPlaza[]): Map<string, TollPlaza> {
  return new Map(plazas.map((plaza) => [plaza.id, plaza]));
}

/**
 * Backward compatibility static PLAZA_MAP
 */
export const PLAZA_MAP = createPlazaMap(TOLL_PLAZAS);

/**
 * Helper to determine if an expressway line is a Flat-Rate / Single-Price open system
 */
export function isFlatRateLine(lineName: string): boolean {
  const flatKeywords = [
    'หมายเลข 9',
    'สาย 9',
    'เฉลิมมหานคร',
    'ฉลองรัช',
    'ศรีรัช',
    'ประจิมรัถยา',
    'อุตราภิมุข',
  ];
  return flatKeywords.some((kw) => lineName.includes(kw));
}

/**
 * Strict BFS to find all reachable destination plaza IDs from an origin plaza based strictly on graph edges
 */
export function getStrictReachableDestinations(
  originId: string,
  allPlazas: TollPlaza[],
  allEdges: TollEdge[] = TOLL_EDGES
): Set<string> {
  const adjacencyList = new Map<string, string[]>();
  for (const edge of allEdges) {
    if (!adjacencyList.has(edge.from_plaza_id)) {
      adjacencyList.set(edge.from_plaza_id, []);
    }
    adjacencyList.get(edge.from_plaza_id)!.push(edge.to_plaza_id);

    if (!adjacencyList.has(edge.to_plaza_id)) {
      adjacencyList.set(edge.to_plaza_id, []);
    }
    adjacencyList.get(edge.to_plaza_id)!.push(edge.from_plaza_id);
  }

  const reachable = new Set<string>();
  const queue: string[] = [originId];
  reachable.add(originId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      if (!reachable.has(neighbor)) {
        reachable.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  const plazaMap = createPlazaMap(allPlazas);
  const result = new Set<string>();
  for (const id of reachable) {
    const p = plazaMap.get(id);
    if (p && (p.is_exit !== false || id === originId)) {
      result.add(id);
    }
  }
  return result;
}

/**
 * Strict BFS to find all origin plaza IDs that can reach the given destination plaza based strictly on graph edges
 */
export function getStrictReachableOrigins(
  destinationId: string,
  allPlazas: TollPlaza[],
  allEdges: TollEdge[] = TOLL_EDGES
): Set<string> {
  const reverseAdjacencyList = new Map<string, string[]>();
  for (const edge of allEdges) {
    if (!reverseAdjacencyList.has(edge.to_plaza_id)) {
      reverseAdjacencyList.set(edge.to_plaza_id, []);
    }
    reverseAdjacencyList.get(edge.to_plaza_id)!.push(edge.from_plaza_id);

    if (!reverseAdjacencyList.has(edge.from_plaza_id)) {
      reverseAdjacencyList.set(edge.from_plaza_id, []);
    }
    reverseAdjacencyList.get(edge.from_plaza_id)!.push(edge.to_plaza_id);
  }

  const reachable = new Set<string>();
  const queue: string[] = [destinationId];
  reachable.add(destinationId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = reverseAdjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      if (!reachable.has(neighbor)) {
        reachable.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  const plazaMap = createPlazaMap(allPlazas);
  const result = new Set<string>();
  for (const id of reachable) {
    const p = plazaMap.get(id);
    if (p && (p.is_entry !== false || id === destinationId)) {
      result.add(id);
    }
  }
  return result;
}

/**
 * Helper to get reachable destination plazas from an origin plaza based strictly on network graph connectivity
 */
export function getValidDestinationsForOrigin(
  origin: TollPlaza | null,
  allPlazas: TollPlaza[],
  allEdges: TollEdge[] = TOLL_EDGES
): TollPlaza[] {
  if (!origin) return allPlazas.filter((p) => p.is_exit !== false);
  const reachableIds = getStrictReachableDestinations(origin.id, allPlazas, allEdges);
  return allPlazas.filter((p) => reachableIds.has(p.id));
}

/**
 * Helper to get reachable origin plazas that can reach a destination plaza based strictly on network graph connectivity
 */
export function getValidOriginsForDestination(
  destination: TollPlaza | null,
  allPlazas: TollPlaza[],
  allEdges: TollEdge[] = TOLL_EDGES
): TollPlaza[] {
  if (!destination) return allPlazas.filter((p) => p.is_entry !== false);
  const reachableIds = getStrictReachableOrigins(destination.id, allPlazas, allEdges);
  return allPlazas.filter((p) => reachableIds.has(p.id));
}

/**
 * Normalizes expressway line name to System Key
 */
function getSystemKey(expresswayLine: string): string {
  if (!expresswayLine) return 'UNKNOWN';
  if (expresswayLine.includes('เฉลิมมหานคร') || (expresswayLine.includes('ศรีรัช') && !expresswayLine.includes('ประจิมรัถยา'))) {
    return 'URBAN_INTEGRATED_NETWORK';
  }
  if (expresswayLine.includes('ประจิมรัถยา')) return 'PRACHIM_RATTHAYA';
  if (expresswayLine.includes('ฉลองรัช')) return 'CHALONG_RAT';
  if (expresswayLine.includes('อุดรรัถยา')) return 'UDON_RATTHAYA';
  if (expresswayLine.includes('อุตราภิมุข') || expresswayLine.includes('โทลล์เวย์')) return 'DMT_TOLLWAY';
  if (expresswayLine.includes('บูรพาวิถี')) return 'BURAPHA_WITHI';
  if (expresswayLine.includes('กาญจนาภิเษก')) return 'KANCHANAPHISEK';
  if (expresswayLine.includes('สาย 9') || expresswayLine.includes('หมายเลข 9')) return 'MOTORWAY_M9';
  if (expresswayLine.includes('สาย 7') || expresswayLine.includes('หมายเลข 7')) return 'MOTORWAY_M7';
  if (expresswayLine.includes('สาย 81') || expresswayLine.includes('หมายเลข 81')) return 'MOTORWAY_M81';
  return expresswayLine;
}

/**
 * Calculates system flat rate for open systems
 */
function getSystemFlatRate(
  systemKey: string,
  vehicleClass: VehicleClass,
  fromPlazaId: string,
  toPlazaId: string,
  distanceKm: number
): number {
  switch (systemKey) {
    case 'URBAN_INTEGRATED_NETWORK':
      return vehicleClass === 'class_1' ? 50 : vehicleClass === 'class_2' ? 75 : 110;

    case 'PRACHIM_RATTHAYA':
      return vehicleClass === 'class_1' ? 65 : vehicleClass === 'class_2' ? 105 : 150;

    case 'CHALONG_RAT':
      return vehicleClass === 'class_1' ? 45 : vehicleClass === 'class_2' ? 70 : 95;

    case 'UDON_RATTHAYA': {
      const s1Set = new Set(['bem-chaeng-watthana', 'bem-muang-thong', 'bem-sri-samarn']);
      const s2Set = new Set(['bem-bang-phun', 'bem-chiang-rak', 'bem-bang-pa-in']);

      if (s1Set.has(fromPlazaId) && s1Set.has(toPlazaId)) {
        return vehicleClass === 'class_1' ? 45 : vehicleClass === 'class_2' ? 100 : 150;
      }
      if (s2Set.has(fromPlazaId) && s2Set.has(toPlazaId)) {
        return vehicleClass === 'class_1' ? 55 : vehicleClass === 'class_2' ? 120 : 180;
      }
      return vehicleClass === 'class_1' ? 85 : vehicleClass === 'class_2' ? 180 : 270;
    }

    case 'DMT_TOLLWAY': {
      const dmtSouth = new Set(['dmt-din-daeng', 'dmt-sutthisan', 'dmt-lad-prao', 'dmt-ratchada']);
      const dmtNorth = new Set(['dmt-lak-si', 'dmt-don-mueang', 'dmt-anusorn-sit']);

      if (dmtSouth.has(fromPlazaId) && dmtSouth.has(toPlazaId)) {
        return vehicleClass === 'class_1' ? 90 : 120;
      }
      if (dmtNorth.has(fromPlazaId) && dmtNorth.has(toPlazaId)) {
        return vehicleClass === 'class_1' ? 40 : 50;
      }
      return vehicleClass === 'class_1' ? 130 : 170;
    }

    case 'BURAPHA_WITHI': {
      if (distanceKm <= 10) return vehicleClass === 'class_1' ? 20 : vehicleClass === 'class_2' ? 40 : 60;
      if (distanceKm <= 20) return vehicleClass === 'class_1' ? 25 : vehicleClass === 'class_2' ? 50 : 75;
      if (distanceKm <= 30) return vehicleClass === 'class_1' ? 40 : vehicleClass === 'class_2' ? 80 : 120;
      if (distanceKm <= 40) return vehicleClass === 'class_1' ? 55 : vehicleClass === 'class_2' ? 110 : 165;
      if (distanceKm <= 48) return vehicleClass === 'class_1' ? 65 : vehicleClass === 'class_2' ? 130 : 195;
      return vehicleClass === 'class_1' ? 70 : vehicleClass === 'class_2' ? 145 : 220;
    }

    case 'KANCHANAPHISEK': {
      if (distanceKm <= 8) return vehicleClass === 'class_1' ? 15 : vehicleClass === 'class_2' ? 25 : 35;
      if (distanceKm <= 15) return vehicleClass === 'class_1' ? 25 : vehicleClass === 'class_2' ? 45 : 60;
      if (distanceKm <= 22) return vehicleClass === 'class_1' ? 35 : vehicleClass === 'class_2' ? 60 : 85;
      return vehicleClass === 'class_1' ? 40 : vehicleClass === 'class_2' ? 70 : 95;
    }

    case 'MOTORWAY_M9':
      return vehicleClass === 'class_1' ? 60 : vehicleClass === 'class_2' ? 100 : 140;

    case 'MOTORWAY_M7':
      if (distanceKm <= 30) return vehicleClass === 'class_1' ? 25 : vehicleClass === 'class_2' ? 45 : 65;
      if (distanceKm <= 60) return vehicleClass === 'class_1' ? 60 : vehicleClass === 'class_2' ? 100 : 145;
      if (distanceKm <= 90) return vehicleClass === 'class_1' ? 105 : vehicleClass === 'class_2' ? 170 : 245;
      return vehicleClass === 'class_1' ? 130 : vehicleClass === 'class_2' ? 210 : 305;

    case 'MOTORWAY_M81':
      return 0;

    default:
      return 0;
  }
}

/**
 * Calculates optimal toll route and consolidated fare breakdown between origin and destination.
 */
export function calculateRoute(
  originId: string,
  destinationId: string,
  vehicleClass: VehicleClass = 'class_1',
  allPlazas: TollPlaza[] = TOLL_PLAZAS,
  allEdges: TollEdge[] = TOLL_EDGES
): FareCalculationResult | null {
  const plazaMap = createPlazaMap(allPlazas);
  const originPlaza = plazaMap.get(originId);
  const destinationPlaza = plazaMap.get(destinationId);

  if (!originPlaza || !destinationPlaza) {
    return null;
  }

  // Case 1: Same Origin and Destination
  if (originId === destinationId) {
    return {
      total_fare: 0,
      vehicle_class: vehicleClass,
      legs: [],
      total_distance_km: 0,
      operators_involved: [originPlaza.operator],
      compatible_payment_methods: originPlaza.payment_methods,
      full_route_coords: [originPlaza.coords],
    };
  }

  // Check valid destination rule
  const validDests = getValidDestinationsForOrigin(originPlaza, allPlazas, allEdges);
  const isValidDest = validDests.some((p) => p.id === destinationId);
  if (!isValidDest) {
    return null;
  }

  // Build adjacency list for Dijkstra graph traversal
  const adjacencyList = new Map<string, TollEdge[]>();
  for (const edge of allEdges) {
    if (!adjacencyList.has(edge.from_plaza_id)) {
      adjacencyList.set(edge.from_plaza_id, []);
    }
    adjacencyList.get(edge.from_plaza_id)!.push(edge);

    // If reverse edge doesn't exist explicitly, add synthetic reverse
    const hasReverse = allEdges.some(
      (e) => e.from_plaza_id === edge.to_plaza_id && e.to_plaza_id === edge.from_plaza_id
    );
    if (!hasReverse) {
      if (!adjacencyList.has(edge.to_plaza_id)) {
        adjacencyList.set(edge.to_plaza_id, []);
      }
      adjacencyList.get(edge.to_plaza_id)!.push({
        ...edge,
        id: `${edge.id}-rev`,
        from_plaza_id: edge.to_plaza_id,
        to_plaza_id: edge.from_plaza_id,
        path_coords: edge.path_coords ? [...edge.path_coords].reverse() : undefined,
      });
    }
  }

  // Dijkstra algorithm for shortest physical route
  const distances = new Map<string, number>();
  const previousEdge = new Map<string, TollEdge>();
  const previousPlaza = new Map<string, string>();
  const unvisited = new Set<string>();

  for (const plaza of allPlazas) {
    distances.set(plaza.id, Infinity);
    unvisited.add(plaza.id);
  }
  distances.set(originId, 0);

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const plazaId of unvisited) {
      const dist = distances.get(plazaId)!;
      if (dist < minDistance) {
        minDistance = dist;
        currentId = plazaId;
      }
    }

    if (currentId === null || minDistance === Infinity) {
      break;
    }

    if (currentId === destinationId) {
      break;
    }

    unvisited.delete(currentId);

    const edges = adjacencyList.get(currentId) || [];
    for (const edge of edges) {
      if (!unvisited.has(edge.to_plaza_id)) continue;

      const altDistance = distances.get(currentId)! + edge.distance_km;
      if (altDistance < distances.get(edge.to_plaza_id)!) {
        distances.set(edge.to_plaza_id, altDistance);
        previousEdge.set(edge.to_plaza_id, edge);
        previousPlaza.set(edge.to_plaza_id, currentId);
      }
    }
  }

  // Reconstruct path of edges
  const edgesPath: TollEdge[] = [];
  let curr: string | undefined = destinationId;

  while (curr && previousEdge.has(curr)) {
    const edge = previousEdge.get(curr)!;
    edgesPath.unshift(edge);
    curr = previousPlaza.get(curr);
  }

  // If no path found via Dijkstra, attempt direct edge lookup
  if (edgesPath.length === 0 && originId !== destinationId) {
    const directEdge = allEdges.find(
      (e) =>
        (e.from_plaza_id === originId && e.to_plaza_id === destinationId) ||
        (e.from_plaza_id === destinationId && e.to_plaza_id === originId)
    );
    if (directEdge) {
      edgesPath.push(directEdge);
    } else {
      return null;
    }
  }

  // Consolidated Multi-System Fare Breakdown Calculation
  let totalDistance = 0;
  const legs: RouteLeg[] = [];
  const operatorsSet = new Set<Operator>();
  const paymentMethodsSets: Set<PaymentTag>[] = [];
  const fullCoords: [number, number][] = [];

  const originSysKey = getSystemKey(originPlaza.expressway_line);
  const destSysKey = getSystemKey(destinationPlaza.expressway_line);
  const systemsCharged = new Set<string>();

  for (const edge of edgesPath) {
    const fromP = plazaMap.get(edge.from_plaza_id)!;
    const toP = plazaMap.get(edge.to_plaza_id)!;
    const isTransfer = edge.id.startsWith('transfer-') || edge.expressway_line.includes('ทางเชื่อม') || edge.is_transfer === true;
    const sourceUrl = edge.official_source_url || OPERATORS[edge.operator]?.official_source_url;

    totalDistance += edge.distance_km;
    operatorsSet.add(edge.operator);
    paymentMethodsSets.push(new Set(edge.payment_methods));

    const pathCoords = edge.path_coords || [fromP.coords, toP.coords];
    let legFee = 0;

    if (isTransfer) {
      // Key Interchange Hub transfer ramps NEVER charge a toll
      legFee = 0;
    } else {
      const edgeSysKey = getSystemKey(edge.expressway_line);
      const isClosedSystem = ['BURAPHA_WITHI', 'KANCHANAPHISEK', 'MOTORWAY_M7', 'MOTORWAY_M81'].includes(edgeSysKey);

      if (isClosedSystem) {
        // Closed distance-based system: use edge.rates directly from dataset
        legFee = edge.rates[vehicleClass] ?? 0;
        systemsCharged.add(edgeSysKey);
      } else {
        // Open flat-rate system: charge flat fee once per open system
        if (!systemsCharged.has(edgeSysKey)) {
          systemsCharged.add(edgeSysKey);
          legFee = edge.rates[vehicleClass] || getSystemFlatRate(edgeSysKey, vehicleClass, edge.from_plaza_id, edge.to_plaza_id, edge.distance_km);
        } else {
          legFee = 0;
        }
      }
    }

    legs.push({
      id: edge.id,
      operator: edge.operator,
      expressway_line: isTransfer ? 'ทางเชื่อมต่างระดับ (Interchange Ramp)' : edge.expressway_line,
      from_plaza: fromP,
      to_plaza: toP,
      fee: legFee,
      rates: isTransfer ? { class_1: 0, class_2: 0, class_3: 0 } : edge.rates,
      payment_methods: edge.payment_methods,
      official_source_url: sourceUrl,
      path_coords: pathCoords,
      is_transfer: isTransfer,
    });

    if (fullCoords.length === 0) {
      fullCoords.push(...pathCoords);
    } else {
      fullCoords.push(...pathCoords.slice(1));
    }
  }

  // Ensure origin plaza's open system fee is included if starting on open system before transfer
  if (!systemsCharged.has(originSysKey) && originSysKey !== 'MOTORWAY_M81') {
    const isClosed = ['BURAPHA_WITHI', 'KANCHANAPHISEK', 'MOTORWAY_M7'].includes(originSysKey);
    if (!isClosed) {
      systemsCharged.add(originSysKey);
      const originFee = getSystemFlatRate(originSysKey, vehicleClass, originId, destinationId, totalDistance);
      if (legs.length > 0) {
        legs[0].fee += originFee;
      }
    }
  }

  // Ensure destination's open system fee is included if ending on open system after transfer
  if (!systemsCharged.has(destSysKey) && destSysKey !== originSysKey && destSysKey !== 'MOTORWAY_M81') {
    const isClosed = ['BURAPHA_WITHI', 'KANCHANAPHISEK', 'MOTORWAY_M7'].includes(destSysKey);
    if (!isClosed) {
      systemsCharged.add(destSysKey);
      const destFee = getSystemFlatRate(destSysKey, vehicleClass, originId, destinationId, totalDistance);
      if (legs.length > 0) {
        legs[legs.length - 1].fee += destFee;
      }
    }
  }

  const totalFare = legs.reduce((sum, leg) => sum + leg.fee, 0);

  const compatiblePayments: PaymentTag[] = ['EASY_PASS', 'M_PASS', 'M_FLOW', 'EMV', 'CASH'].filter(
    (tag) => paymentMethodsSets.length > 0 && paymentMethodsSets.every((set) => set.has(tag as PaymentTag))
  ) as PaymentTag[];

  return {
    total_fare: totalFare,
    vehicle_class: vehicleClass,
    legs: legs,
    total_distance_km: Math.round(totalDistance * 10) / 10,
    operators_involved: Array.from(operatorsSet),
    compatible_payment_methods: compatiblePayments,
    full_route_coords: fullCoords,
  };
}

export function searchPlazas(term: string, plazas: TollPlaza[] = TOLL_PLAZAS): TollPlaza[] {
  if (!term.trim()) return plazas;
  const lower = term.toLowerCase().trim();

  return plazas.filter(
    (p) =>
      p.name_th.toLowerCase().includes(lower) ||
      p.name_en.toLowerCase().includes(lower) ||
      p.expressway_line.toLowerCase().includes(lower) ||
      p.operator.toLowerCase().includes(lower)
  );
}
