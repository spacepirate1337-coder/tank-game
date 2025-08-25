# Claude Development Notes

## Project Overview
This is a web-based clone of the classic 1991 tank combat game Spectre, built following ADR-001 specifications for a faithful recreation using modern web technologies.

## Architecture Decisions

### Core Technology Stack
- **TypeScript**: Static typing for error prevention and code clarity
- **Three.js**: 3D graphics rendering with WebGL 2.0 backend
- **React**: UI components for menu, HUD, and game interface
- **Zustand**: Lightweight state management for UI state
- **Vite**: Fast development server and optimized production builds
- **Web Audio API**: Procedural sound generation for authentic retro audio

### Entity-Component-System (ECS) Architecture
Built a custom ECS implementation using Plain Old JavaScript Objects (POJOs):

- **Entities**: Simple ID-based objects that group components
- **Components**: Data-only structures (Position, Velocity, Health, etc.)
- **Systems**: Logic processors that operate on entities with specific components

### Key Systems Implementation

#### Core Game Systems
1. **PhysicsSystem**: Handles movement, rotation, and basic physics
2. **CollisionSystem**: Tank separation, projectile hits, world boundaries
3. **InputSystem**: Player controls with firing cooldown mechanics
4. **RenderSystem**: Three.js mesh creation and management
5. **AISystem**: Enemy behavior (patrol, hunt, flee) with combat tactics
6. **CameraSystem**: Over-the-shoulder following camera with smooth interpolation

#### Specialized Systems
7. **HealthSystem**: Death mechanics and explosion triggering
8. **ExplosionSystem**: Animated explosion effects with scaling/fading
9. **ProjectileSystem**: Bullet lifetime management
10. **WireframeSystem**: Dynamic wireframe mode toggling
11. **HUDSystem**: Real-time UI updates for health/enemy count

### Game Entity Design

#### Player Tank
- Complex geometry: Body + turret + barrel (THREE.Group)
- Components: Position, Velocity, Health, PlayerControlled, Renderable
- Controls: WASD/Arrow keys for movement, Space for firing

#### Enemy Tanks  
- Parallelepiped geometry: Tilted parallelogram faces with rectangular sides
- Components: Position, Velocity, Health, AIControlled, Renderable
- AI Behaviors: Maintain optimal combat distance, strafe, retreat when too close

#### Projectiles
- Simple sphere geometry with collision detection
- Components: Position, Velocity, Projectile (damage, speed, lifetime, ownerId)
- Owner-based collision prevention

#### Explosions
- Expanding sphere with transparency animation
- Components: Position, Explosion (lifetime tracking)
- Procedural scaling and fade-out effects

### Audio Implementation
Procedural sound generation using Web Audio API:
- **Fire Sound**: Noise + tone with exponential decay
- **Explosion Sound**: Low-frequency rumble with noise burst
- **Engine Sound**: Harmonic base frequencies with noise overlay

### Camera System
Over-the-shoulder third-person camera:
- Follows player tank with rotational offset
- Smooth interpolation using Vector3.lerp()
- Dynamic look-at targeting for cinematic feel

## Development Approach

### Problem-Solving Methodology
1. **Incremental Development**: Built core systems first, then specialized features
2. **Debug-Driven Development**: Added extensive console logging during troubleshooting
3. **Component Composition**: Used ECS principles for flexible entity creation
4. **Real-time Feedback**: Implemented immediate visual/audio feedback for all actions

### Key Technical Challenges Solved

#### Canvas Initialization Issue
- **Problem**: Canvas ref was null during React useEffect
- **Solution**: Implemented callback ref pattern to ensure canvas availability

#### Collision Detection Accuracy
- **Problem**: Hit detection wasn't registering properly
- **Solution**: Added debug logging and fixed owner-based collision filtering

#### AI Behavior Balance
- **Problem**: Enemies either too passive or too aggressive
- **Solution**: Implemented distance-based behavior with optimal combat range

#### Wireframe Mode Toggle
- **Problem**: Wireframe toggle caused canvas re-initialization
- **Solution**: Created dedicated WireframeSystem to modify material properties

### Performance Optimizations
- **Mesh Caching**: Render system caches Three.js meshes to prevent recreation
- **Entity Cleanup**: Proper disposal of removed entities and their meshes
- **Frame Rate Limiting**: Game loop targets 60 FPS with setTimeout throttling
- **Component Filtering**: Systems only process entities with required components

## Command Reference

### Development
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run typecheck # Type checking without emit
```

### Game Controls
- **Movement**: WASD or Arrow keys
- **Fire**: Spacebar
- **Wireframe**: F key
- **Pause**: P key

### Debug Features
- Console logging for collision detection
- Real-time health tracking
- Enemy count monitoring
- Explosion effect debugging

## File Structure
```
src/
├── ecs/           # Core ECS architecture
├── components/    # Game data structures
├── systems/       # Game logic processors  
├── renderer/      # Three.js rendering
├── ui/           # React UI components
└── assets/       # Game resources
```

This implementation successfully recreates the classic Spectre gameplay while leveraging modern web technologies for enhanced performance and maintainability.