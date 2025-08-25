import * as THREE from 'three';
import { System } from '../ecs/System';
import { Position } from '../components';

export class CameraSystem extends System {
  private camera: THREE.Camera;
  private cameraOffset = new THREE.Vector3(0, 8, -12);
  private targetPosition = new THREE.Vector3();
  private currentPosition = new THREE.Vector3();

  constructor(entityManager: any, camera: THREE.Camera) {
    super(entityManager);
    this.camera = camera;
    this.currentPosition.copy(this.camera.position);
  }

  update(): void {
    const playerEntities = this.getEntitiesWithComponents('playerControlled', 'position');
    
    if (playerEntities.length === 0) return;
    
    const player = playerEntities[0];
    const playerPos = player.components.position as Position;
    
    const rotatedOffset = this.cameraOffset.clone();
    rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerPos.rotation);
    
    this.targetPosition.set(
      playerPos.x + rotatedOffset.x,
      playerPos.y + rotatedOffset.y,
      playerPos.z + rotatedOffset.z
    );
    
    this.currentPosition.lerp(this.targetPosition, 0.1);
    this.camera.position.copy(this.currentPosition);
    
    const lookAtTarget = new THREE.Vector3(playerPos.x, playerPos.y + 2, playerPos.z);
    this.camera.lookAt(lookAtTarget);
  }
}