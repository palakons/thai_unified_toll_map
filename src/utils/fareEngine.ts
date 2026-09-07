import { TollPlaza, TollEdge, VehicleClass, Operator, PaymentTag, FareCalculationResult, RouteLeg } from '../types/toll';
import { TOLL_PLAZAS, TOLL_EDGES, OPERATORS } from '../data/tollNetwork';

/**
 * Maps plaza ID to TollPlaza object for O(1) lookup
 */
export const PLAZA_MAP = new Map<string, TollPlaza>(
  TOLL_PLAZAS.map((plaza) => [plaza.id, plaza])
);

/**
 * Helper to determine if an expressway line is a Flat-Rate / Single-Price open system
 */
export function isFlatRateLine(lineName: string): boolean {
  const flatKeywords = [
    'หมายเลข 9',
    'เฉลิมมหานคร',
    'ฉลองรัช',
    'ศรีรัช',
    'ประจิมรัถยา',
    'อุตราภิมุข',
  ];
  return flatKeywords.some((kw) => lineName.includes(kw));
}

/**
 * Helper to get valid destination plazas based on Same-Line rule or Flat-Rate rule
 */
export function getValidDestinationsForOrigin(
  origin: TollPlaza | null,
  allPlazas: TollPlaza[]
): TollPlaza[] {
  if (!origin) return allPlazas;

  // Rule 1: If Flat-Rate / Open System line, allow same operator or same system line
  if (isFlatRateLine(origin.expressway_line)) {
    return allPlazas.filter((p) => p.operator === origin.operator);
  }

  // Rule 2: Distance-based closed lines (e.g. Motorway M7, Burapha Withi, Udon Ratthaya) MUST be on the exact SAME LINE
  return allPlazas.filter(
    (p) =>
      p.expressway_line.toLowerCase().trim() === origin.expressway_line.toLowerCase().trim() ||
      (origin.expressway_line.includes('มอเตอร์เวย์สาย 7') && p.expressway_line.includes('มอเตอร์เวย์สาย 7'))
  );
}

/**
 * Calculates optimal toll route and consolidated fare breakdown between origin and destination
 */
export function calculateRoute(
  originId: string,
  destinationId: string,
  vehicleClass: VehicleClass = 'class_1'
): FareCalculationResult | null {
  const originPlaza = PLAZA_MAP.get(originId);
  const destinationPlaza = PLAZA_MAP.get(destinationId);

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
  const validDests = getValidDestinationsForOrigin(originPlaza, TOLL_PLAZAS);
  const isValidDest = validDests.some((p) => p.id === destinationId);
  if (!isValidDest) {
    return null;
  }

  // Build adjacency list for graph traversal
  const adjacencyList = new Map<string, TollEdge[]>();
  for (const edge of TOLL_EDGES) {
    if (!adjacencyList.has(edge.from_plaza_id)) {
      adjacencyList.set(edge.from_plaza_id, []);
    }
    adjacencyList.get(edge.from_plaza_id)!.push(edge);
  }

  // Dijkstra algorithm
  const distances = new Map<string, number>();
  const previousEdge = new Map<string, TollEdge>();
  const previousPlaza = new Map<string, string>();
  const unvisited = new Set<string>();

  for (const plaza of TOLL_PLAZAS) {
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

  // Reconstruct path
  if (!previousEdge.has(destinationId) && originId !== destinationId) {
    const directEdge = TOLL_EDGES.find(
      (e) =>
        (e.from_plaza_id === originId && e.to_plaza_id === destinationId) ||
        (e.from_plaza_id === destinationId && e.to_plaza_id === originId)
    );

    if (directEdge) {
      const fromP = PLAZA_MAP.get(directEdge.from_plaza_id)!;
      const toP = PLAZA_MAP.get(directEdge.to_plaza_id)!;
      const fee = directEdge.rates[vehicleClass] || 0;
      const pathCoords = directEdge.path_coords || [fromP.coords, toP.coords];
      const sourceUrl = directEdge.official_source_url || OPERATORS[directEdge.operator]?.official_source_url;

      return {
        total_fare: fee,
        vehicle_class: vehicleClass,
        legs: [
          {
            id: directEdge.id,
            operator: directEdge.operator,
            expressway_line: directEdge.expressway_line,
            from_plaza: fromP,
            to_plaza: toP,
            fee: fee,
            rates: directEdge.rates,
            payment_methods: directEdge.payment_methods,
            official_source_url: sourceUrl,
            path_coords: pathCoords,
          },
        ],
        total_distance_km: directEdge.distance_km,
        operators_involved: [directEdge.operator],
        compatible_payment_methods: directEdge.payment_methods,
        full_route_coords: pathCoords,
      };
    }

    return null;
  }

  const edgesPath: TollEdge[] = [];
  let curr: string | undefined = destinationId;

  while (curr && previousEdge.has(curr)) {
    const edge = previousEdge.get(curr)!;
    edgesPath.unshift(edge);
    curr = previousPlaza.get(curr);
  }

  let totalFare = 0;
  let totalDistance = 0;
  const legs: RouteLeg[] = [];
  const operatorsSet = new Set<Operator>();
  const paymentMethodsSets: Set<PaymentTag>[] = [];
  const fullCoords: [number, number][] = [];

  for (const edge of edgesPath) {
    const fromP = PLAZA_MAP.get(edge.from_plaza_id)!;
    const toP = PLAZA_MAP.get(edge.to_plaza_id)!;
    const fee = edge.rates[vehicleClass] || 0;
    const sourceUrl = edge.official_source_url || OPERATORS[edge.operator]?.official_source_url;

    totalFare += fee;
    totalDistance += edge.distance_km;
    operatorsSet.add(edge.operator);
    paymentMethodsSets.push(new Set(edge.payment_methods));

    const pathCoords = edge.path_coords || [fromP.coords, toP.coords];

    legs.push({
      id: edge.id,
      operator: edge.operator,
      expressway_line: edge.expressway_line,
      from_plaza: fromP,
      to_plaza: toP,
      fee: fee,
      rates: edge.rates,
      payment_methods: edge.payment_methods,
      official_source_url: sourceUrl,
      path_coords: pathCoords,
    });

    if (fullCoords.length === 0) {
      fullCoords.push(...pathCoords);
    } else {
      fullCoords.push(...pathCoords.slice(1));
    }
  }

  const compatiblePayments: PaymentTag[] = ['EASY_PASS', 'M_PASS', 'M_FLOW', 'EMV', 'CASH'].filter(
    (tag) => paymentMethodsSets.some((set) => set.has(tag as PaymentTag))
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

export function searchPlazas(term: string): TollPlaza[] {
  if (!term.trim()) return TOLL_PLAZAS;
  const lower = term.toLowerCase().trim();

  return TOLL_PLAZAS.filter(
    (p) =>
      p.name_th.toLowerCase().includes(lower) ||
      p.name_en.toLowerCase().includes(lower) ||
      p.expressway_line.toLowerCase().includes(lower) ||
      p.operator.toLowerCase().includes(lower)
  );
}
