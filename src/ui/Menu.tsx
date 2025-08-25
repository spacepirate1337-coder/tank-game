import React from 'react';
import { useGameStore } from './GameStore';

interface MenuProps {
  onStartGame: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onStartGame }) => {
  const { setGameStatus, wireframeMode, toggleWireframe, volume, setVolume } = useGameStore();

  const handleStartGame = () => {
    setGameStatus('playing');
    onStartGame();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#00ff00',
      fontFamily: 'Courier New, monospace',
      fontSize: '18px',
      zIndex: 1000
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '40px'
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '20px',
          textShadow: '4px 4px 8px rgba(0,255,0,0.3)',
          letterSpacing: '4px'
        }}>
          SPECTRE
        </h1>
        
        <p style={{
          fontSize: '14px',
          marginBottom: '40px',
          opacity: 0.8,
          lineHeight: '1.6'
        }}>
          A web-based clone of the classic 1991 tank combat game.<br />
          Navigate the battlefield, destroy enemy tanks, and survive as long as possible.
        </p>

        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={handleStartGame}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid #00ff00',
              color: '#00ff00',
              padding: '15px 30px',
              fontSize: '18px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00ff00';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#00ff00';
            }}
          >
            START GAME
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label>Wireframe Mode:</label>
            <button
              onClick={toggleWireframe}
              style={{
                backgroundColor: wireframeMode ? '#00ff00' : 'transparent',
                border: '1px solid #00ff00',
                color: wireframeMode ? '#000' : '#00ff00',
                padding: '5px 15px',
                fontSize: '14px',
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
            >
              {wireframeMode ? 'ON' : 'OFF'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label>Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{
                width: '150px',
                cursor: 'pointer'
              }}
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>
        </div>

        <div style={{
          marginTop: '40px',
          fontSize: '12px',
          opacity: 0.6,
          textAlign: 'left'
        }}>
          <h3>CONTROLS:</h3>
          <p>W/A/S/D or Arrow Keys: Move tank<br />
          SPACE: Fire cannon<br />
          F: Toggle wireframe mode<br />
          P: Pause game</p>
        </div>
      </div>
    </div>
  );
};