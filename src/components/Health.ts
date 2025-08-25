export interface Health {
  current: number;
  maximum: number;
}

export function createHealth(maximum: number = 100, current?: number): Health {
  return {
    current: current !== undefined ? current : maximum,
    maximum
  };
}