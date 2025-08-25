import { System } from '../ecs/System';
import { Position, Velocity, AIControlled } from '../components';
import { createPosition, createVelocity, createRenderable, createProjectile } from '../components';

export class AISystem extends System {
  update(): void {
    const aiEntities = this.getEntitiesWithComponents('aiControlled', 'position', 'velocity');

    for (const entity of aiEntities) {
      const ai = entity.components.aiControlled as AIControlled;
      const position = entity.components.position as Position;
      const velocity = entity.components.velocity as Velocity;

      switch (ai.behavior) {
        case 'patrol':
          this.patrolBehavior(ai, position, velocity);
          break;
        case 'hunt':
          this.huntBehavior(ai, position, velocity);
          break;
        case 'flee':
          this.fleeBehavior(ai, position, velocity);
          break;
      }

      this.updateTargetDetection(ai, position);
      this.handleFiring(entity, ai, position);
    }
  }

  private patrolBehavior(ai: AIControlled, position: Position, velocity: Velocity): void {
    if (ai.waypoints.length === 0) {
      velocity.dx = 0;
      velocity.dz = 0;
      return;
    }

    const target = ai.waypoints[ai.currentWaypoint];
    const dx = target.x - position.x;
    const dz = target.z - position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 2) {
      ai.currentWaypoint = (ai.currentWaypoint + 1) % ai.waypoints.length;
    } else {
      const targetAngle = Math.atan2(dx, dz);
      this.moveTowardsAngle(position, velocity, targetAngle, ai.patrolSpeed);
    }
  }

  private huntBehavior(ai: AIControlled, position: Position, velocity: Velocity): void {
    if (!ai.targetId) {
      ai.behavior = 'patrol';
      return;
    }

    const target = this.entityManager.getEntity(ai.targetId);
    if (!target || !target.components.position) {
      ai.targetId = undefined;
      ai.behavior = 'patrol';
      return;
    }

    const targetPos = target.components.position as Position;
    const dx = targetPos.x - position.x;
    const dz = targetPos.z - position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > ai.detectionRange * 1.5) {
      ai.targetId = undefined;
      ai.behavior = 'patrol';
      return;
    }

    const optimalDistance = 15;
    const targetAngle = Math.atan2(dx, dz);
    
    if (distance < optimalDistance * 0.7) {
      const retreatAngle = targetAngle + Math.PI;
      this.moveTowardsAngle(position, velocity, retreatAngle, ai.patrolSpeed * 0.8);
    } else if (distance > optimalDistance * 1.3) {
      this.moveTowardsAngle(position, velocity, targetAngle, ai.patrolSpeed * 1.2);
    } else {
      const strafeAngle = targetAngle + Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      this.moveTowardsAngle(position, velocity, strafeAngle, ai.patrolSpeed);
    }
  }

  private fleeBehavior(ai: AIControlled, position: Position, velocity: Velocity): void {
    if (!ai.targetId) {
      ai.behavior = 'patrol';
      return;
    }

    const target = this.entityManager.getEntity(ai.targetId);
    if (!target || !target.components.position) {
      ai.targetId = undefined;
      ai.behavior = 'patrol';
      return;
    }

    const targetPos = target.components.position as Position;
    const dx = position.x - targetPos.x;
    const dz = position.z - targetPos.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > ai.detectionRange * 2) {
      ai.behavior = 'patrol';
      return;
    }

    const fleeAngle = Math.atan2(dx, dz);
    this.moveTowardsAngle(position, velocity, fleeAngle, ai.patrolSpeed * 2);
  }

  private moveTowardsAngle(position: Position, velocity: Velocity, targetAngle: number, speed: number): void {
    let angleDiff = targetAngle - position.rotation;
    
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    const turnSpeed = 1.5;
    if (Math.abs(angleDiff) > 0.2) {
      velocity.rotationSpeed = Math.sign(angleDiff) * turnSpeed;
      velocity.dx = Math.sin(position.rotation) * speed * 0.3;
      velocity.dz = Math.cos(position.rotation) * speed * 0.3;
    } else {
      velocity.rotationSpeed = Math.sign(angleDiff) * turnSpeed * 0.3;
      velocity.dx = Math.sin(position.rotation) * speed;
      velocity.dz = Math.cos(position.rotation) * speed;
    }
  }

  private updateTargetDetection(ai: AIControlled, position: Position): void {
    if (ai.behavior === 'hunt' && ai.targetId) return;

    const playerEntities = this.getEntitiesWithComponents('playerControlled', 'position');
    
    for (const player of playerEntities) {
      const playerPos = player.components.position as Position;
      const dx = playerPos.x - position.x;
      const dz = playerPos.z - position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < ai.detectionRange) {
        ai.targetId = player.id;
        ai.behavior = 'hunt';
        break;
      }
    }
  }

  private handleFiring(entity: any, ai: AIControlled, position: Position): void {
    if (!ai.targetId) return;

    const target = this.entityManager.getEntity(ai.targetId);
    if (!target || !target.components.position) return;

    const targetPos = target.components.position as Position;
    const dx = targetPos.x - position.x;
    const dz = targetPos.z - position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > ai.detectionRange || distance < 8) return;

    const currentTime = performance.now() / 1000;
    if (currentTime - ai.lastFireTime > 1 / ai.fireRate) {
      const targetAngle = Math.atan2(dx, dz);
      let angleDiff = Math.abs(targetAngle - position.rotation);
      
      if (angleDiff > Math.PI) {
        angleDiff = Math.PI * 2 - angleDiff;
      }
      
      if (angleDiff < 0.3) {
        this.createProjectile(entity.id, position);
        ai.lastFireTime = currentTime;
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
    this.entityManager.addComponent(projectile.id, 'renderable', createRenderable(undefined, false, 0xff8800));
  }
}