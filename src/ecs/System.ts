import { Entity, EntityManager } from './Entity';

export abstract class System {
  protected entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  abstract update(deltaTime: number): void;

  protected getEntitiesWithComponents(...componentNames: string[]): Entity[] {
    return this.entityManager.getEntitiesWithComponents(...componentNames);
  }
}

export class SystemManager {
  private systems: System[] = [];

  addSystem(system: System): void {
    this.systems.push(system);
  }

  removeSystem(system: System): void {
    const index = this.systems.indexOf(system);
    if (index > -1) {
      this.systems.splice(index, 1);
    }
  }

  update(deltaTime: number): void {
    for (const system of this.systems) {
      system.update(deltaTime);
    }
  }
}