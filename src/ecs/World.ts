import { EntityManager } from './Entity';
import { SystemManager } from './System';

export class World {
  public entityManager: EntityManager;
  public systemManager: SystemManager;

  constructor() {
    this.entityManager = new EntityManager();
    this.systemManager = new SystemManager();
  }

  update(deltaTime: number): void {
    this.systemManager.update(deltaTime);
  }
}