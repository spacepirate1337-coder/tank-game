import { Game } from './Game';
import { 
  PhysicsSystem, 
  CollisionSystem, 
  InputSystem, 
  RenderSystem, 
  ProjectileSystem, 
  AISystem,
  CameraSystem,
  WireframeSystem,
  HealthSystem,
  ExplosionSystem,
  HUDSystem 
} from './systems';
import { AudioManager } from './systems/AudioSystem';
import { 
  createPosition, 
  createVelocity, 
  createRenderable, 
  createHealth, 
  createPlayerControlled,
  createAIControlled
} from './components';

export class GameManager {
  private game: Game;
  private audioManager: AudioManager;
  private wireframeSystem: WireframeSystem;
  private hudSystem?: HUDSystem;
  
  constructor(canvas: HTMLCanvasElement) {
    console.log('GameManager constructor starting');
    try {
      console.log('Creating Game...');
      this.game = new Game(canvas);
      console.log('Game created');
      
      console.log('Creating AudioManager...');
      try {
        this.audioManager = new AudioManager();
        console.log('AudioManager created');
      } catch (error) {
        console.warn('AudioManager failed, continuing without audio:', error);
        this.audioManager = null as any; // Temporary fallback
      }
      
      console.log('Initializing systems...');
      this.initializeSystems();
      console.log('Systems initialized');
      
      console.log('Setting up entities...');
      this.setupEntities();
      console.log('Entities set up');
    } catch (error) {
      console.error('Error in GameManager constructor:', error);
      throw error;
    }
  }

  private initializeSystems(): void {
    const world = this.game.getWorld();
    const renderer = this.game.getRenderer();
    
    world.systemManager.addSystem(new InputSystem(world.entityManager, this.audioManager));
    world.systemManager.addSystem(new PhysicsSystem(world.entityManager));
    world.systemManager.addSystem(new CollisionSystem(world.entityManager));
    world.systemManager.addSystem(new ProjectileSystem(world.entityManager));
    world.systemManager.addSystem(new AISystem(world.entityManager));
    world.systemManager.addSystem(new HealthSystem(world.entityManager, this.audioManager));
    world.systemManager.addSystem(new ExplosionSystem(world.entityManager));
    world.systemManager.addSystem(new CameraSystem(world.entityManager, renderer.camera));
    this.wireframeSystem = new WireframeSystem(world.entityManager, renderer.scene);
    world.systemManager.addSystem(this.wireframeSystem);
    world.systemManager.addSystem(new RenderSystem(world.entityManager, renderer.scene));
  }

  private setupEntities(): void {
    this.createPlayer();
    this.createEnemyTanks(3);
    this.createArena();
  }

  private createPlayer(): void {
    const world = this.game.getWorld();
    const player = world.entityManager.createEntity();

    world.entityManager.addComponent(player.id, 'position', createPosition(0, 0, 0, 0));
    world.entityManager.addComponent(player.id, 'velocity', createVelocity());
    world.entityManager.addComponent(player.id, 'renderable', createRenderable(undefined, false, 0x00ff00));
    world.entityManager.addComponent(player.id, 'health', createHealth(100));
    world.entityManager.addComponent(player.id, 'playerControlled', createPlayerControlled());
  }

  private createEnemyTanks(count: number): void {
    const world = this.game.getWorld();
    
    for (let i = 0; i < count; i++) {
      const enemy = world.entityManager.createEntity();
      const angle = (i / count) * Math.PI * 2;
      const distance = 40 + Math.random() * 20;
      
      const x = Math.sin(angle) * distance;
      const z = Math.cos(angle) * distance;
      
      const waypoints = this.generatePatrolWaypoints(x, z, 20);

      world.entityManager.addComponent(enemy.id, 'position', createPosition(x, 0, z, angle));
      world.entityManager.addComponent(enemy.id, 'velocity', createVelocity());
      world.entityManager.addComponent(enemy.id, 'renderable', createRenderable(undefined, false, 0xff0000));
      world.entityManager.addComponent(enemy.id, 'health', createHealth(75));
      world.entityManager.addComponent(enemy.id, 'aiControlled', createAIControlled('patrol', waypoints, 0.8, 25, 8));
    }
  }

  private generatePatrolWaypoints(centerX: number, centerZ: number, radius: number) {
    const waypoints = [];
    const numPoints = 4;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      waypoints.push({
        x: centerX + Math.sin(angle) * radius,
        z: centerZ + Math.cos(angle) * radius
      });
    }
    
    return waypoints;
  }

  private createArena(): void {
    // Add arena boundaries or decorative elements if needed
  }

  start(): void {
    this.game.start();
  }

  stop(): void {
    this.game.stop();
  }

  getAudioManager(): AudioManager {
    return this.audioManager;
  }

  toggleWireframe(): void {
    if (this.wireframeSystem) {
      const currentMode = this.wireframeSystem.getWireframeMode();
      this.wireframeSystem.setWireframeMode(!currentMode);
    }
  }

  setHUDCallbacks(setHealth: (health: number) => void, setEnemiesRemaining: (count: number) => void): void {
    const world = this.game.getWorld();
    this.hudSystem = new HUDSystem(world.entityManager, setHealth, setEnemiesRemaining);
    world.systemManager.addSystem(this.hudSystem);
  }

  dispose(): void {
    this.game.dispose();
  }
}