import { System } from '../ecs/System';
import { Health } from '../components';

export class HUDSystem extends System {
  private setHealth: (health: number) => void;
  private setEnemiesRemaining: (count: number) => void;

  constructor(
    entityManager: any, 
    setHealth: (health: number) => void,
    setEnemiesRemaining: (count: number) => void
  ) {
    super(entityManager);
    this.setHealth = setHealth;
    this.setEnemiesRemaining = setEnemiesRemaining;
  }

  update(): void {
    // Update player health
    const playerEntities = this.getEntitiesWithComponents('playerControlled', 'health');
    if (playerEntities.length > 0) {
      const playerHealth = playerEntities[0].components.health as Health;
      this.setHealth(Math.max(0, playerHealth.current));
    }

    // Update enemy count
    const enemyEntities = this.getEntitiesWithComponents('aiControlled', 'health');
    this.setEnemiesRemaining(enemyEntities.length);
  }
}