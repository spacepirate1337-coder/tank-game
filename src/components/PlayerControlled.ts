export interface PlayerControlled {
  moveSpeed: number;
  turnSpeed: number;
  forwardPressed: boolean;
  backwardPressed: boolean;
  leftPressed: boolean;
  rightPressed: boolean;
  firePressed: boolean;
}

export function createPlayerControlled(
  moveSpeed: number = 10,
  turnSpeed: number = 2
): PlayerControlled {
  return {
    moveSpeed,
    turnSpeed,
    forwardPressed: false,
    backwardPressed: false,
    leftPressed: false,
    rightPressed: false,
    firePressed: false
  };
}