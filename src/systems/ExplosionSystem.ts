import { System } from '../ecs/System';

export class ExplosionSystem extends System {
  update(deltaTime: number): void {
    const explosions = this.getEntitiesWithComponents('explosion');

    for (const entity of explosions) {
      const explosion = entity.components.explosion;
      
      explosion.lifetime -= deltaTime;
      
      // Update explosion visual properties based on remaining lifetime
      if (entity.components.renderable && entity.components.renderable.mesh) {
        const progress = 1 - (explosion.lifetime / explosion.maxLifetime);
        const scale = 1 + progress * 3; // Grow explosion
        const opacity = 1 - progress; // Fade out
        
        entity.components.renderable.mesh.scale.set(scale, scale, scale);
        
        if (entity.components.renderable.mesh.material) {
          entity.components.renderable.mesh.material.opacity = opacity;
          entity.components.renderable.mesh.material.transparent = true;
        }
      }
      
      if (explosion.lifetime <= 0) {
        this.entityManager.removeEntity(entity.id);
      }
    }
  }
}