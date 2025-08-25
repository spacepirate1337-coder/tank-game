import { System } from '../ecs/System';
import { Projectile } from '../components';

export class ProjectileSystem extends System {
  update(deltaTime: number): void {
    const projectiles = this.getEntitiesWithComponents('projectile');

    for (const entity of projectiles) {
      const projectile = entity.components.projectile as Projectile;
      
      projectile.lifetime -= deltaTime;
      
      if (projectile.lifetime <= 0) {
        this.entityManager.removeEntity(entity.id);
      }
    }
  }
}