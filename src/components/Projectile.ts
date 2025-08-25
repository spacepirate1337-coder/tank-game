export interface Projectile {
  damage: number;
  speed: number;
  lifetime: number;
  ownerId: number;
}

export function createProjectile(
  damage: number = 25,
  speed: number = 50,
  lifetime: number = 3.0,
  ownerId: number
): Projectile {
  return { damage, speed, lifetime, ownerId };
}