export interface AIControlled {
  behavior: 'patrol' | 'hunt' | 'flee';
  targetId?: number;
  waypoints: Array<{ x: number, z: number }>;
  currentWaypoint: number;
  fireRate: number;
  lastFireTime: number;
  detectionRange: number;
  patrolSpeed: number;
}

export function createAIControlled(
  behavior: 'patrol' | 'hunt' | 'flee' = 'patrol',
  waypoints: Array<{ x: number, z: number }> = [],
  fireRate: number = 1.0,
  detectionRange: number = 30,
  patrolSpeed: number = 5
): AIControlled {
  return {
    behavior,
    waypoints,
    currentWaypoint: 0,
    fireRate,
    lastFireTime: 0,
    detectionRange,
    patrolSpeed
  };
}