import { System } from '../ecs/System';
import { Position } from '../components';


export class CollisionSystem extends System {
  private worldBounds = {
    minX: -100,
    maxX: 100,
    minZ: -100,
    maxZ: 100
  };

  update(): void {
    this.handleWorldBounds();
    this.handleEntityCollisions();
  }

  private handleWorldBounds(): void {
    const entities = this.getEntitiesWithComponents('position');

    for (const entity of entities) {
      const position = entity.components.position as Position;

      if (position.x < this.worldBounds.minX) {
        position.x = this.worldBounds.minX;
      } else if (position.x > this.worldBounds.maxX) {
        position.x = this.worldBounds.maxX;
      }

      if (position.z < this.worldBounds.minZ) {
        position.z = this.worldBounds.minZ;
      } else if (position.z > this.worldBounds.maxZ) {
        position.z = this.worldBounds.maxZ;
      }
    }
  }

  private handleEntityCollisions(): void {
    const entities = this.getEntitiesWithComponents('position');
    
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];
        
        if (this.checkCollision(entityA.components.position, entityB.components.position)) {
          this.resolveCollision(entityA, entityB);
        }
      }
    }
  }

  private checkCollision(posA: Position, posB: Position): boolean {
    const distance = Math.sqrt(
      Math.pow(posA.x - posB.x, 2) + 
      Math.pow(posA.z - posB.z, 2)
    );
    return distance < 3;
  }

  private resolveCollision(entityA: any, entityB: any): void {
    if (entityA.components.projectile && entityB.components.health) {
      this.handleProjectileHit(entityA, entityB);
    } else if (entityB.components.projectile && entityA.components.health) {
      this.handleProjectileHit(entityB, entityA);
    } else if (this.bothAreTanks(entityA, entityB)) {
      this.separateTanks(entityA, entityB);
    }
  }

  private bothAreTanks(entityA: any, entityB: any): boolean {
    const hasPlayerOrAI_A = entityA.components.playerControlled || entityA.components.aiControlled;
    const hasPlayerOrAI_B = entityB.components.playerControlled || entityB.components.aiControlled;
    return hasPlayerOrAI_A && hasPlayerOrAI_B;
  }

  private separateTanks(entityA: any, entityB: any): void {
    const posA = entityA.components.position as Position;
    const posB = entityB.components.position as Position;
    
    const dx = posB.x - posA.x;
    const dz = posB.z - posA.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance > 0) {
      const normalX = dx / distance;
      const normalZ = dz / distance;
      
      const separationDistance = 3;
      const overlap = separationDistance - distance;
      const separation = overlap / 2;
      
      posA.x -= normalX * separation;
      posA.z -= normalZ * separation;
      posB.x += normalX * separation;
      posB.z += normalZ * separation;
      
      if (entityA.components.velocity) {
        const velA = entityA.components.velocity;
        const dotProductA = velA.dx * normalX + velA.dz * normalZ;
        if (dotProductA > 0) {
          velA.dx -= dotProductA * normalX;
          velA.dz -= dotProductA * normalZ;
        }
      }
      
      if (entityB.components.velocity) {
        const velB = entityB.components.velocity;
        const dotProductB = velB.dx * (-normalX) + velB.dz * (-normalZ);
        if (dotProductB > 0) {
          velB.dx -= dotProductB * (-normalX);
          velB.dz -= dotProductB * (-normalZ);
        }
      }
    }
  }

  private handleProjectileHit(projectile: any, target: any): void {
    if (projectile.components.projectile.ownerId !== target.id) {
      if (target.components.health) {
        target.components.health.current -= projectile.components.projectile.damage;
      }
      this.entityManager.removeEntity(projectile.id);
    }
  }
}