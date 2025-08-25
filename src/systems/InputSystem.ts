import { System } from '../ecs/System';
import { PlayerControlled, Velocity, Position } from '../components';
import { createPosition, createVelocity, createRenderable, createProjectile } from '../components';

export class InputSystem extends System {
  private keys: Set<string> = new Set();
  private audioManager: any;

  constructor(entityManager: any, audioManager?: any) {
    super(entityManager);
    this.audioManager = audioManager;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      e.preventDefault();
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      e.preventDefault();
    });

    window.addEventListener('blur', () => {
      this.keys.clear();
    });
  }

  update(): void {
    const playerEntities = this.getEntitiesWithComponents('playerControlled', 'velocity', 'position');

    for (const entity of playerEntities) {
      const playerControl = entity.components.playerControlled as PlayerControlled;
      const velocity = entity.components.velocity as Velocity;
      const position = entity.components.position as Position;

      this.updateInputState(playerControl);
      this.updateMovement(playerControl, velocity, position);
      this.handleFiring(entity, playerControl, position);
    }
  }

  private updateInputState(playerControl: PlayerControlled): void {
    playerControl.forwardPressed = this.keys.has('ArrowUp') || this.keys.has('KeyW');
    playerControl.backwardPressed = this.keys.has('ArrowDown') || this.keys.has('KeyS');
    playerControl.leftPressed = this.keys.has('ArrowLeft') || this.keys.has('KeyA');
    playerControl.rightPressed = this.keys.has('ArrowRight') || this.keys.has('KeyD');
    playerControl.firePressed = this.keys.has('Space');
  }

  private updateMovement(playerControl: PlayerControlled, velocity: Velocity, position: Position): void {
    velocity.dx = 0;
    velocity.dz = 0;
    velocity.rotationSpeed = 0;

    if (playerControl.forwardPressed) {
      velocity.dx = Math.sin(position.rotation) * playerControl.moveSpeed;
      velocity.dz = Math.cos(position.rotation) * playerControl.moveSpeed;
    }
    
    if (playerControl.backwardPressed) {
      velocity.dx = -Math.sin(position.rotation) * playerControl.moveSpeed * 0.5;
      velocity.dz = -Math.cos(position.rotation) * playerControl.moveSpeed * 0.5;
    }

    if (playerControl.leftPressed) {
      velocity.rotationSpeed = playerControl.turnSpeed;
    }
    
    if (playerControl.rightPressed) {
      velocity.rotationSpeed = -playerControl.turnSpeed;
    }
  }

  private handleFiring(entity: any, playerControl: PlayerControlled, position: Position): void {
    if (playerControl.firePressed && !entity.components.fireCooldown) {
      this.createProjectile(entity.id, position);
      
      if (this.audioManager) {
        this.audioManager.playSound('fire', 0.5);
      }
      
      entity.components.fireCooldown = { remaining: 0.25 };
    }
    
    if (entity.components.fireCooldown) {
      entity.components.fireCooldown.remaining -= 1/60;
      if (entity.components.fireCooldown.remaining <= 0) {
        delete entity.components.fireCooldown;
      }
    }
  }

  private createProjectile(ownerId: number, position: Position): void {
    const projectile = this.entityManager.createEntity();
    
    this.entityManager.addComponent(projectile.id, 'position', createPosition(
      position.x + Math.sin(position.rotation) * 2,
      position.y,
      position.z + Math.cos(position.rotation) * 2,
      position.rotation
    ));
    
    this.entityManager.addComponent(projectile.id, 'velocity', createVelocity(
      Math.sin(position.rotation) * 50,
      0,
      Math.cos(position.rotation) * 50
    ));
    
    this.entityManager.addComponent(projectile.id, 'projectile', createProjectile(25, 50, 3.0, ownerId));
    this.entityManager.addComponent(projectile.id, 'renderable', createRenderable(undefined, false, 0xff0000));
  }
}