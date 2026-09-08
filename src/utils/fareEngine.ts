import { TollPlaza, TollEdge, VehicleClass, Operator, PaymentTag, FareCalculationResult, RouteLeg } from '../types/toll';
import { TOLL_PLAZAS, TOLL_EDGES, OPERATORS, M7_COMPLETE_MATRIX } from '../data/tollNetwork';

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

    // Bidirectional fallback if missing reverse
    const hasReverse = allEdges.some(
      (e) => e.from_plaza_id === edge.to_plaza_id && e.to_plaza_id === edge.from_plaza_id
    );
    if (!hasReverse) {
      if (!adjacencyList.has(edge.to_plaza_id)) {
        adjacencyList.set(edge.to_plaza_id, []);
      }
      adjacencyList.get(edge.to_plaza_id)!.push(edge.from_plaza_id);
    }
  }

  const reachable = new Set<string>();
  const queue: string[] = [originId];
  const visited = new Set<string>([originId]);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    reachable.add(curr);

    const neighbors = adjacencyList.get(curr) || [];
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return reachable;
}

/**
 * Strict BFS to find all valid origin plaza IDs that can reach a given destination plaza
 */
export function getStrictReachableOrigins(
  destinationId: string,
  allPlazas: TollPlaza[],
  allEdges: TollEdge[] = TOLL_EDGES
): Set<string> {
  const reverseAdjacency = new Map<string, string[]>();
  for (const edge of allEdges) {
    if (!reverseAdjacency.has(edge.to_plaza_id)) {
      reverseAdjacency.set(edge.to_plaza_id, []);
    }
    reverseAdjacency.get(edge.to_plaza_id)!.push(edge.from_plaza_id);

    const hasReverse = allEdges.some(
      (e) => e.from_plaza_id === edge.to_plaza_id && e.to_plaza_id === edge.from_plaza_id
    );
    if (!hasReverse) {
      if (!reverseAdjacency.has(edge.from_plaza_id)) {
        reverseAdjacency.set(edge.from_plaza_id, []);
      }
      reverseAdjacency.get(edge.from_plaza_id)!.push(edge.to_plaza_id);
    }
  }

  const reachable = new Set<string>();
  const queue: string[] = [destinationId];
  const visited = new Set<string>([destinationId]);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    reachable.add(curr);

    const predecessors = reverseAdjacency.get(curr) || [];
    for (const prev of predecessors) {
      if (!visited.has(prev)) {
        visited.add(prev);
        queue.push(prev);
      }
    }
  }

  return reachable;
}

/**
 * Gets valid destinations for an origin plaza
 */
export function getValidDestinationsForOrigin(
  originPlaza: TollPlaza | null,
  allPlazas: TollPlaza[] = TOLL_PLAZAS,
  allEdges: TollEdge[] = TOLL_EDGES
): TollPlaza[] {
  if (!originPlaza) return allPlazas.filter((p) => p.is_exit !== false);
  const reachableSet = getStrictReachableDestinations(originPlaza.id, allPlazas, allEdges);
  return allPlazas.filter((p) => p.id !== originPlaza.id && reachableSet.has(p.id));
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
  if (expresswayLine.includes('ส่วนต่อขยาย')) return 'DMT_DOH_EXTENSION';
  if (expresswayLine.includes('ช่วงดินแดง-ดอนเมือง') || expresswayLine.includes('ดินแดง-ดอนเมือง')) return 'DMT_URBAN';
  if (expresswayLine.includes('ช่วงดอนเมือง-อนุสรณ์สถาน') || expresswayLine.includes('ดอนเมือง-อนุสรณ์สถาน')) return 'DMT_NORTH';
  if (expresswayLine.includes('อุตราภิมุข') || expresswayLine.includes('โทลล์เวย์')) return 'DMT_TOLLWAY';
  if (expresswayLine.includes('บูรพาวิถี')) return 'BURAPHA_WITHI';
  if (expresswayLine.includes('กาญจนาภิเษก')) return 'KANCHANAPHISEK';
  if (expresswayLine.includes('สาย 9') || expresswayLine.includes('หมายเลข 9')) return 'MOTORWAY_M9';
  if (expresswayLine.includes('สาย 7') || expresswayLine.includes('หมายเลข 7')) return 'MOTORWAY_M7';
  if (expresswayLine.includes('สาย 81') || expresswayLine.includes('หมายเลข 81')) return 'MOTORWAY_M81';
  if (expresswayLine.includes('สาย 6') || expresswayLine.includes('หมายเลข 6') || expresswayLine.includes('M6')) return 'MOTORWAY_M6';
  return expresswayLine;
}

/**
 * Calculates system flat rate for open systems using exact plaza entry_rates if available
 */
function getSystemFlatRate(
  systemKey: string,
  vehicleClass: VehicleClass,
  fromPlazaId: string,
  toPlazaId: string,
  distanceKm: number,
  plazaMap?: Map<string, TollPlaza>
): number {
  switch (systemKey) {
    case 'DMT_URBAN':
      return vehicleClass === 'class_1' ? 90 : 120;

    case 'DMT_NORTH':
      return vehicleClass === 'class_1' ? 40 : 50;

    case 'URBAN_INTEGRATED_NETWORK':
      return vehicleClass === 'class_1' ? 50 : vehicleClass === 'class_2' ? 75 : 110;

    case 'PRACHIM_RATTHAYA':
      return vehicleClass === 'class_1' ? 65 : vehicleClass === 'class_2' ? 105 : 150;

    case 'CHALONG_RAT':
      return vehicleClass === 'class_1' ? 45 : vehicleClass === 'class_2' ? 70 : 95;

    case 'UDON_RATTHAYA':
      return vehicleClass === 'class_1' ? 45 : vehicleClass === 'class_2' ? 100 : 150;

    case 'DMT_TOLLWAY':
      return vehicleClass === 'class_1' ? 90 : 120;

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

    case 'MOTORWAY_M7': {
      // Check M7 official matrix lookup
      const matrixRate = M7_COMPLETE_MATRIX[fromPlazaId]?.[toPlazaId] || M7_COMPLETE_MATRIX[toPlazaId]?.[fromPlazaId];
      if (matrixRate) {
        const idx = vehicleClass === 'class_1' ? 0 : vehicleClass === 'class_2' ? 1 : 2;
        return matrixRate[idx];
      }
      if (distanceKm <= 30) return vehicleClass === 'class_1' ? 25 : vehicleClass === 'class_2' ? 45 : 65;
      if (distanceKm <= 60) return vehicleClass === 'class_1' ? 60 : vehicleClass === 'class_2' ? 100 : 145;
      if (distanceKm <= 90) return vehicleClass === 'class_1' ? 105 : vehicleClass === 'class_2' ? 170 : 245;
      return vehicleClass === 'class_1' ? 130 : vehicleClass === 'class_2' ? 210 : 305;
    }

    case 'DMT_DOH_EXTENSION':
    case 'MOTORWAY_M6':
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

  // Group contiguous edges by system key
  interface SystemBlock {
    sysKey: string;
    isTransfer: boolean;
    edges: TollEdge[];
  }
  const blocks: SystemBlock[] = [];

  for (const edge of edgesPath) {
    const isTransfer = edge.id.startsWith('transfer-') || edge.expressway_line.includes('ทางเชื่อม') || edge.is_transfer === true;
    const sysKey = isTransfer ? 'TRANSFER' : getSystemKey(edge.expressway_line);

    if (blocks.length === 0 || blocks[blocks.length - 1].sysKey !== sysKey) {
      blocks.push({
        sysKey: sysKey,
        isTransfer: isTransfer,
        edges: [edge],
      });
    } else {
      blocks[blocks.length - 1].edges.push(edge);
    }
  }

  for (const block of blocks) {
    if (block.isTransfer) {
      for (const edge of block.edges) {
        const fromP = plazaMap.get(edge.from_plaza_id)!;
        const toP = plazaMap.get(edge.to_plaza_id)!;
        const sourceUrl = edge.official_source_url || OPERATORS[edge.operator]?.official_source_url;
        const pathCoords = edge.path_coords || [fromP.coords, toP.coords];

        totalDistance += edge.distance_km;
        operatorsSet.add(edge.operator);
        paymentMethodsSets.push(new Set(edge.payment_methods));

        legs.push({
          id: edge.id,
          operator: edge.operator,
          expressway_line: 'ทางเชื่อมต่างระดับ (Interchange Ramp)',
          from_plaza: fromP,
          to_plaza: toP,
          fee: 0,
          rates: { class_1: 0, class_2: 0, class_3: 0 },
          payment_methods: edge.payment_methods,
          official_source_url: sourceUrl,
          path_coords: pathCoords,
          is_transfer: true,
        });

        if (fullCoords.length === 0) {
          fullCoords.push(...pathCoords);
        } else {
          fullCoords.push(...pathCoords.slice(1));
        }
      }
    } else {
      const blockStartPlaza = plazaMap.get(block.edges[0].from_plaza_id)!;
      const blockEndPlaza = plazaMap.get(block.edges[block.edges.length - 1].to_plaza_id)!;
      const blockDist = block.edges.reduce((sum, e) => sum + e.distance_km, 0);
      const systemFee = getSystemFlatRate(
        block.sysKey,
        vehicleClass,
        blockStartPlaza.id,
        blockEndPlaza.id,
        blockDist,
        plazaMap
      );

      for (let i = 0; i < block.edges.length; i++) {
        const edge = block.edges[i];
        const fromP = plazaMap.get(edge.from_plaza_id)!;
        const toP = plazaMap.get(edge.to_plaza_id)!;
        const sourceUrl = edge.official_source_url || OPERATORS[edge.operator]?.official_source_url;
        const pathCoords = edge.path_coords || [fromP.coords, toP.coords];
        const legFee = i === 0 ? systemFee : 0;

        totalDistance += edge.distance_km;
        operatorsSet.add(edge.operator);
        paymentMethodsSets.push(new Set(edge.payment_methods));

        legs.push({
          id: edge.id,
          operator: edge.operator,
          expressway_line: edge.expressway_line,
          from_plaza: fromP,
          to_plaza: toP,
          fee: legFee,
          rates: i === 0 ? edge.rates : { class_1: 0, class_2: 0, class_3: 0 },
          payment_methods: edge.payment_methods,
          official_source_url: sourceUrl,
          path_coords: pathCoords,
          is_transfer: false,
        });

        if (fullCoords.length === 0) {
          fullCoords.push(...pathCoords);
        } else {
          fullCoords.push(...pathCoords.slice(1));
        }
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
