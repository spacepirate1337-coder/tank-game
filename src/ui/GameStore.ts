import { create } from 'zustand';

export interface GameState {
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver';
  score: number;
  health: number;
  enemiesRemaining: number;
  wireframeMode: boolean;
  volume: number;
  showFPS: boolean;
}

interface GameStore extends GameState {
  setGameStatus: (status: GameState['gameStatus']) => void;
  setScore: (score: number) => void;
  setHealth: (health: number) => void;
  setEnemiesRemaining: (count: number) => void;
  toggleWireframe: () => void;
  setVolume: (volume: number) => void;
  toggleFPS: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  gameStatus: 'menu',
  score: 0,
  health: 100,
  enemiesRemaining: 0,
  wireframeMode: false,
  volume: 0.5,
  showFPS: false
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setGameStatus: (status) => set({ gameStatus: status }),
  setScore: (score) => set({ score }),
  setHealth: (health) => set({ health }),
  setEnemiesRemaining: (enemiesRemaining) => set({ enemiesRemaining }),
  toggleWireframe: () => set((state) => ({ wireframeMode: !state.wireframeMode })),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  toggleFPS: () => set((state) => ({ showFPS: !state.showFPS })),
  resetGame: () => set(initialState)
}));