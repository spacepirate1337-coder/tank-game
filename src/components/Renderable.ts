import * as THREE from 'three';

export interface Renderable {
  mesh?: THREE.Mesh | THREE.Group;
  wireframe?: boolean;
  color?: number;
  visible?: boolean;
}

export function createRenderable(
  mesh?: THREE.Mesh | THREE.Group,
  wireframe: boolean = false,
  color: number = 0x00ff00,
  visible: boolean = true
): Renderable {
  return { mesh, wireframe, color, visible };
}