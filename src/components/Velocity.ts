export interface Velocity {
  dx: number;
  dy: number;
  dz: number;
  rotationSpeed: number;
}

export function createVelocity(dx: number = 0, dy: number = 0, dz: number = 0, rotationSpeed: number = 0): Velocity {
  return { dx, dy, dz, rotationSpeed };
}