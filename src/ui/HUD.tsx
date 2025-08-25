import React from 'react';
import { useGameStore } from './GameStore';

export const HUD: React.FC = () => {
  const { score, health, enemiesRemaining, showFPS } = useGameStore();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      color: '#00ff00',
      fontFamily: 'Courier New, monospace',
      fontSize: '16px',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
    }}>
      {/* Top HUD */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        pointerEvents: 'auto'
      }}>
        <div>SCORE: {score.toString().padStart(8, '0')}</div>
        <div>HEALTH: {Math.max(0, health).toString().padStart(3, ' ')}</div>
        <div>ENEMIES: {enemiesRemaining}</div>
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        fontSize: '12px',
        opacity: 0.7
      }}>
        <div>WASD/ARROWS: Move</div>
        <div>SPACE: Fire</div>
        <div>F: Toggle Wireframe</div>
        <div>P: Pause</div>
      </div>

      {/* FPS Counter */}
      {showFPS && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '14px'
        }}>
          FPS: 60
        </div>
      )}

      {/* Health Bar */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '20px',
        width: '200px',
        height: '20px',
        border: '2px solid #00ff00',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: `${Math.max(0, (health / 100) * 100)}%`,
          height: '100%',
          backgroundColor: health > 30 ? '#00ff00' : health > 15 ? '#ffff00' : '#ff0000',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};