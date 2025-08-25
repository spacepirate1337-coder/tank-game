let entityIdCounter = 0;

export interface Entity {
  id: number;
  components: Record<string, any>;
}

export class EntityManager {
  private entities: Map<number, Entity> = new Map();

  createEntity(): Entity {
    const entity: Entity = {
      id: ++entityIdCounter,
      components: {}
    };
    this.entities.set(entity.id, entity);
    return entity;
  }

  removeEntity(id: number): void {
    this.entities.delete(id);
  }

  getEntity(id: number): Entity | undefined {
    return this.entities.get(id);
  }

  getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  getEntitiesWithComponents(...componentNames: string[]): Entity[] {
    return this.getAllEntities().filter(entity => 
      componentNames.every(name => entity.components[name] !== undefined)
    );
  }

  addComponent(entityId: number, componentName: string, component: any): void {
    const entity = this.getEntity(entityId);
    if (entity) {
      entity.components[componentName] = component;
    }
  }

  removeComponent(entityId: number, componentName: string): void {
    const entity = this.getEntity(entityId);
    if (entity) {
      delete entity.components[componentName];
    }
  }

  hasComponent(entityId: number, componentName: string): boolean {
    const entity = this.getEntity(entityId);
    return entity ? entity.components[componentName] !== undefined : false;
  }
}