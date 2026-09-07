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
 * Calculates optimal toll route and consolidated fare breakdown between origin and destination
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

  // Build adjacency list for graph traversal (supports directed edges with bidirectional fallback)
  const adjacencyList = new Map<string, TollEdge[]>();
  for (const edge of allEdges) {
    if (!adjacencyList.has(edge.from_plaza_id)) {
      adjacencyList.set(edge.from_plaza_id, []);
    }
    adjacencyList.get(edge.from_plaza_id)!.push(edge);

    // If reverse edge doesn't exist explicitly in edge set, create a synthetic reverse edge
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

  // Dijkstra algorithm
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

  // Reconstruct path
  if (!previousEdge.has(destinationId) && originId !== destinationId) {
    const directEdge = allEdges.find(
      (e) =>
        (e.from_plaza_id === originId && e.to_plaza_id === destinationId) ||
        (e.from_plaza_id === destinationId && e.to_plaza_id === originId)
    );

    if (directEdge) {
      const isForward = directEdge.from_plaza_id === originId;
      const fromP = plazaMap.get(isForward ? directEdge.from_plaza_id : directEdge.to_plaza_id)!;
      const toP = plazaMap.get(isForward ? directEdge.to_plaza_id : directEdge.from_plaza_id)!;
      const fee = directEdge.rates[vehicleClass] || 0;
      let pathCoords = directEdge.path_coords || [fromP.coords, toP.coords];
      if (!isForward && directEdge.path_coords) {
        pathCoords = [...directEdge.path_coords].reverse();
      }
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
    const fromP = plazaMap.get(edge.from_plaza_id)!;
    const toP = plazaMap.get(edge.to_plaza_id)!;
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

  // Payment methods compatible across ALL legs of the journey
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
