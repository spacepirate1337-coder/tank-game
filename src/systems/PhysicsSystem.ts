import { System } from '../ecs/System';
import { Position, Velocity } from '../components';

export class PhysicsSystem extends System {
  update(deltaTime: number): void {
    const entities = this.getEntitiesWithComponents('position', 'velocity');

    for (const entity of entities) {
      const position = entity.components.position as Position;
      const velocity = entity.components.velocity as Velocity;

      position.x += velocity.dx * deltaTime;
      position.y += velocity.dy * deltaTime;
      position.z += velocity.dz * deltaTime;
      position.rotation += velocity.rotationSpeed * deltaTime;

      if (position.rotation > Math.PI * 2) {
        position.rotation -= Math.PI * 2;
      } else if (position.rotation < 0) {
        position.rotation += Math.PI * 2;
      }
    }
  }
}