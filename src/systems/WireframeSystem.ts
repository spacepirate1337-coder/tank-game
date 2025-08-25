import { System } from '../ecs/System';
import * as THREE from 'three';

export class WireframeSystem extends System {
  private wireframeMode: boolean = false;
  private scene: THREE.Scene;

  constructor(entityManager: any, scene: THREE.Scene) {
    super(entityManager);
    this.scene = scene;
  }

  setWireframeMode(enabled: boolean): void {
    if (this.wireframeMode === enabled) return;
    
    this.wireframeMode = enabled;
    console.log('Setting wireframe mode to:', enabled);
    
    // Update all existing meshes
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshBasicMaterial) {
        object.material.wireframe = enabled;
        object.material.needsUpdate = true;
      }
    });
  }

  getWireframeMode(): boolean {
    return this.wireframeMode;
  }

  update(): void {
    // This system doesn't need regular updates
  }
}