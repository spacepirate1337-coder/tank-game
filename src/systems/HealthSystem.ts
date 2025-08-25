import { System } from '../ecs/System';
import { Health, Position } from '../components';
import { createPosition, createVelocity, createRenderable } from '../components';

export class HealthSystem extends System {
  private audioManager: any;

  constructor(entityManager: any, audioManager?: any) {
    super(entityManager);
    this.audioManager = audioManager;
  }

  update(): void {
    const entitiesWithHealth = this.getEntitiesWithComponents('health');

    for (const entity of entitiesWithHealth) {
      const health = entity.components.health as Health;

      if (health.current <= 0) {
        console.log(`Entity ${entity.id} died with health ${health.current}`);
        this.handleDeath(entity);
      }
    }
  }

  private handleDeath(entity: any): void {
    const position = entity.components.position as Position;
    
    if (position) {
      this.createExplosion(position);
    }

    if (this.audioManager) {
      this.audioManager.playSound('explosion', 0.7);
    }

    // Check if this is the player
    if (entity.components.playerControlled) {
      console.log('Player died!');
      // We'll handle game over in a separate system
    }

    // Remove the entity
    this.entityManager.removeEntity(entity.id);
  }

  private createExplosion(position: Position): void {
    const explosion = this.entityManager.createEntity();
    
    this.entityManager.addComponent(explosion.id, 'position', createPosition(
      position.x, position.y + 1, position.z
    ));
    
    this.entityManager.addComponent(explosion.id, 'velocity', createVelocity());
    
    this.entityManager.addComponent(explosion.id, 'renderable', createRenderable(
      undefined, false, 0xffff00
    ));
    
    this.entityManager.addComponent(explosion.id, 'explosion', {
      lifetime: 1.0,
      maxLifetime: 1.0
    });
  }
}