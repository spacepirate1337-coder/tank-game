export interface Position {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

export function createPosition(x: number = 0, y: number = 0, z: number = 0, rotation: number = 0): Position {
  return { x, y, z, rotation };
}