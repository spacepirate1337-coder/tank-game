import * as THREE from 'three';
import { System } from '../ecs/System';
import { Position, Renderable } from '../components';

export class RenderSystem extends System {
  private scene: THREE.Scene;
  private meshCache: Map<number, THREE.Mesh | THREE.Group> = new Map();

  constructor(entityManager: any, scene: THREE.Scene) {
    super(entityManager);
    this.scene = scene;
  }

  update(): void {
    const renderableEntities = this.getEntitiesWithComponents('renderable', 'position');

    for (const entity of renderableEntities) {
      const position = entity.components.position as Position;
      const renderable = entity.components.renderable as Renderable;

      if (!renderable.mesh && !this.meshCache.has(entity.id)) {
        this.createMesh(entity);
      }

      const mesh = renderable.mesh || this.meshCache.get(entity.id);
      if (mesh) {
        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.y = position.rotation;
        mesh.visible = renderable.visible !== false;
      }
    }

    this.cleanupRemovedEntities();
  }

  private createMesh(entity: any): void {
    const renderable = entity.components.renderable as Renderable;
    let mesh: THREE.Mesh | THREE.Group;

    if (entity.components.playerControlled) {
      mesh = this.createTankMesh(renderable.wireframe || false, renderable.color || 0x00ff00);
    } else if (entity.components.aiControlled) {
      mesh = this.createEnemyTankMesh(renderable.wireframe || false, renderable.color || 0xff0000);
    } else if (entity.components.projectile) {
      mesh = this.createProjectileMesh(renderable.color || 0xff0000);
    } else if (entity.components.explosion) {
      mesh = this.createExplosionMesh(renderable.color || 0xffff00);
    } else {
      mesh = this.createDefaultMesh(renderable.wireframe || false, renderable.color || 0xffffff);
    }

    this.scene.add(mesh);
    this.meshCache.set(entity.id, mesh);
    renderable.mesh = mesh;
  }

  private createTankMesh(wireframe: boolean = false, color: number = 0x00ff00): THREE.Group {
    const tank = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(2, 1, 3);
    const turretGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 8);
    const barrelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);

    const material = new THREE.MeshBasicMaterial({ 
      color, 
      wireframe 
    });

    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = 0.5;

    const turret = new THREE.Mesh(turretGeometry, material);
    turret.position.y = 1.25;

    const barrel = new THREE.Mesh(barrelGeometry, material);
    barrel.position.set(0, 1.25, 1.5);
    barrel.rotation.x = Math.PI / 2;

    tank.add(body);
    tank.add(turret);
    tank.add(barrel);

    return tank;
  }

  private createEnemyTankMesh(wireframe: boolean = false, color: number = 0xff0000): THREE.Mesh {
    // Create a parallelepiped (tilted parallelogram faces on top/bottom, rectangles on sides)
    const geometry = new THREE.BufferGeometry();
    
    const vertices = new Float32Array([
      // Bottom face (tilted parallelogram)
      -1, -0.5, -1.5,  // 0
       1, -0.5, -1.5,  // 1
       1.3, -0.5, 1.5, // 2
      -0.7, -0.5, 1.5, // 3
      
      // Top face (tilted parallelogram)
      -1, 0.5, -1.5,   // 4
       1, 0.5, -1.5,   // 5
       1.3, 0.5, 1.5,  // 6
      -0.7, 0.5, 1.5   // 7
    ]);
    
    const indices = [
      // Bottom face
      0, 1, 2,  0, 2, 3,
      // Top face
      4, 6, 5,  4, 7, 6,
      // Front face (rectangle)
      0, 4, 5,  0, 5, 1,
      // Back face (rectangle)
      2, 6, 7,  2, 7, 3,
      // Left face (rectangle)
      0, 3, 7,  0, 7, 4,
      // Right face (rectangle)
      1, 5, 6,  1, 6, 2
    ];
    
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshBasicMaterial({ 
      color, 
      wireframe,
      side: THREE.DoubleSide
    });
    
    const tank = new THREE.Mesh(geometry, material);
    tank.position.y = 0.5;
    
    return tank;
  }

  private createProjectileMesh(color: number = 0xff0000): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
  }

  private createExplosionMesh(color: number = 0xffff00): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.5, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
      color,
      transparent: true,
      opacity: 0.8
    });
    return new THREE.Mesh(geometry, material);
  }

  private createDefaultMesh(wireframe: boolean = false, color: number = 0xffffff): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color, wireframe });
    return new THREE.Mesh(geometry, material);
  }

  private cleanupRemovedEntities(): void {
    const currentEntityIds = new Set(this.entityManager.getAllEntities().map((e: any) => e.id));
    
    for (const [entityId, mesh] of this.meshCache) {
      if (!currentEntityIds.has(entityId)) {
        this.scene.remove(mesh);
        this.meshCache.delete(entityId);
      }
    }
  }

  dispose(): void {
    for (const mesh of this.meshCache.values()) {
      this.scene.remove(mesh);
    }
    this.meshCache.clear();
  }
}