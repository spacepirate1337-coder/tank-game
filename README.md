# Spectre Web Clone

![Spectre Web Clone Screenshot](assets/Screenshot%202025-08-25%20at%2014.10.04.png)

A faithful web-based recreation of the classic 1991 tank combat game Spectre, built with modern web technologies and a custom Entity-Component-System architecture.

## 🎮 Game Features

### Core Gameplay
- **3D Tank Combat**: Real-time battles with physics-based movement
- **AI Enemies**: Intelligent opponents with patrol, hunt, and flee behaviors  
- **Projectile Physics**: Realistic bullet trajectories and collision detection
- **Death Mechanics**: Explosive tank destruction with visual/audio effects
- **Health System**: Damage tracking with real-time HUD updates

### Visual Features
- **Wireframe Mode**: Toggle between filled and wireframe rendering (F key)
- **Over-the-Shoulder Camera**: Cinematic third-person view that follows the player
- **Explosion Effects**: Animated destruction sequences with scaling and fade-out
- **Parallelepiped Enemies**: Geometrically accurate enemy tank shapes
- **Real-time HUD**: Health bars, enemy count, and game statistics

### Audio Features
- **Procedural Sound Effects**: Web Audio API generated firing and explosion sounds
- **Volume Control**: Adjustable master volume in settings
- **Spatial Audio**: Context-aware sound positioning

## 🕹️ Controls

| Control | Action |
|---------|--------|
| **WASD** or **Arrow Keys** | Move tank |
| **Spacebar** | Fire cannon |
| **F** | Toggle wireframe mode |
| **P** | Pause/Resume game |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd tank-game

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to play the game.

### Building for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 🏗️ Architecture

### Technology Stack
- **TypeScript** - Type safety and enhanced developer experience
- **Three.js** - 3D graphics rendering with WebGL 2.0
- **React** - UI components and game interface
- **Zustand** - Lightweight state management
- **Vite** - Fast development and optimized builds
- **Web Audio API** - Procedural sound generation

### Entity-Component-System (ECS)
The game uses a custom ECS architecture for clean separation of data and logic:

- **Entities**: Game objects (tanks, projectiles, explosions)
- **Components**: Data structures (Position, Health, Velocity)
- **Systems**: Logic processors (Physics, Collision, Rendering)

## 🎯 Gameplay Systems

### Tank Combat
- **Player Tank**: Full geometry with turret and barrel
- **Enemy Tanks**: Parallelepiped shapes with tilted faces
- **Collision Physics**: Realistic tank separation and boundary enforcement

### AI Behavior
- **Patrol Mode**: Follow waypoint circuits
- **Hunt Mode**: Engage player at optimal combat distance
- **Flee Mode**: Retreat when heavily damaged
- **Combat Tactics**: Distance management and accurate firing

### Visual Effects
- **Death Explosions**: Expanding sphere animations
- **Health Tracking**: Real-time damage visualization
- **Wireframe Toggle**: Dynamic material property switching

## 🔧 Development

### Project Structure
```
src/
├── ecs/           # Core ECS framework
├── components/    # Game data components
├── systems/       # Game logic systems
├── renderer/      # Three.js rendering
├── ui/           # React UI components
└── assets/       # Game resources
```

### Key Systems
1. **PhysicsSystem** - Movement and rotation
2. **CollisionSystem** - Hit detection and separation
3. **RenderSystem** - 3D mesh management
4. **AISystem** - Enemy behavior logic
5. **HealthSystem** - Damage and death mechanics
6. **CameraSystem** - Player following camera

### Commands
```bash
npm run dev        # Development server
npm run build      # Production build
npm run typecheck  # Type checking
npm run preview    # Preview build
```

## 🎨 Game Design

### Visual Style
- **Retro Aesthetic**: Faithful to 1991 original with modern enhancements
- **Geometric Precision**: Mathematically accurate parallelepiped enemy tanks
- **Minimalist UI**: Clean HUD design with essential information

### Audio Design  
- **Procedural Generation**: All sounds created programmatically
- **Retro Feel**: 8-bit inspired sound effects using Web Audio API
- **Dynamic Audio**: Context-aware volume and spatial positioning

## 📝 License

This project is a educational recreation of the classic Spectre game for learning purposes.

## 🤝 Contributing

This project was developed as a technical demonstration of modern web game development techniques. Feel free to explore the codebase and adapt the ECS architecture for your own projects.

---

**Built with ❤️ using modern web technologies**# Cache refresh
