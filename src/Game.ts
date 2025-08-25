import { World } from './ecs/World';
import { Renderer } from './renderer/Renderer';

export class Game {
  private world: World;
  private renderer: Renderer;
  private lastTime: number = 0;
  private targetFPS: number = 60;
  private targetFrameTime: number = 1000 / this.targetFPS;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.world = new World();
    this.renderer = new Renderer(canvas);
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  stop(): void {
    this.isRunning = false;
  }

  private gameLoop = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    setTimeout(() => {
      requestAnimationFrame(this.gameLoop);
    }, Math.max(0, this.targetFrameTime - (performance.now() - currentTime)));
  };

  private update(deltaTime: number): void {
    this.world.update(deltaTime);
  }

  private render(): void {
    this.renderer.render();
  }

  getWorld(): World {
    return this.world;
  }

  getRenderer(): Renderer {
    return this.renderer;
  }

  dispose(): void {
    this.stop();
    this.renderer.dispose();
  }
}