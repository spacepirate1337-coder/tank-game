import React, { useEffect, useRef, useState } from 'react';
import { GameManager } from './GameManager';
import { HUD } from './ui/HUD';
import { Menu } from './ui/Menu';
import { useGameStore } from './ui/GameStore';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameManagerRef = useRef<GameManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { gameStatus, setGameStatus, toggleWireframe } = useGameStore();

  // Use callback ref to initialize when canvas is available
  const canvasCallback = (canvas: HTMLCanvasElement | null) => {
    console.log('Canvas callback called with:', canvas);
    
    // Don't reinitialize if we already have a GameManager and this is just a re-render
    if (canvas && canvasRef.current && gameManagerRef.current) {
      canvasRef.current = canvas;
      return;
    }
    
    canvasRef.current = canvas;
    
    if (canvas && !gameManagerRef.current) {
      try {
        console.log('Creating GameManager...');
        gameManagerRef.current = new GameManager(canvas);
        
        // Connect HUD system to game state
        const { setHealth, setEnemiesRemaining } = useGameStore.getState();
        gameManagerRef.current.setHUDCallbacks(setHealth, setEnemiesRemaining);
        
        console.log('GameManager created successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Error creating GameManager:', error);
      }
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (gameManagerRef.current) {
        gameManagerRef.current.dispose();
        gameManagerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'KeyF') {
        if (gameManagerRef.current) {
          gameManagerRef.current.toggleWireframe();
        }
        toggleWireframe(); // Also toggle UI state
        e.preventDefault();
      } else if (e.code === 'KeyP' && gameStatus === 'playing') {
        setGameStatus('paused');
        e.preventDefault();
      } else if (e.code === 'KeyP' && gameStatus === 'paused') {
        setGameStatus('playing');
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStatus, toggleWireframe, setGameStatus]);

  const handleStartGame = () => {
    if (gameManagerRef.current) {
      gameManagerRef.current.start();
    }
  };

  const handleReturnToMenu = () => {
    if (gameManagerRef.current) {
      gameManagerRef.current.stop();
    }
    setGameStatus('menu');
  };

  console.log('App render: isInitialized =', isInitialized);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <canvas
        ref={canvasCallback}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          background: '#000'
        }}
      />

      {!isInitialized && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#00ff00',
          fontFamily: 'Courier New, monospace',
          fontSize: '18px',
          zIndex: 2000
        }}>
          Loading... (Check console for debug info)
        </div>
      )}

      {isInitialized && gameStatus === 'menu' && (
        <Menu onStartGame={handleStartGame} />
      )}

      {isInitialized && gameStatus === 'playing' && (
        <HUD />
      )}

      {isInitialized && gameStatus === 'paused' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#00ff00',
          fontFamily: 'Courier New, monospace',
          fontSize: '24px',
          zIndex: 1000
        }}>
          <h2 style={{ marginBottom: '20px' }}>GAME PAUSED</h2>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>Press P to continue</p>
          <button
            onClick={handleReturnToMenu}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid #00ff00',
              color: '#00ff00',
              padding: '10px 20px',
              fontSize: '16px',
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          >
            Return to Menu
          </button>
        </div>
      )}

      {isInitialized && gameStatus === 'gameOver' && (
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
          color: '#ff0000',
          fontFamily: 'Courier New, monospace',
          fontSize: '24px',
          zIndex: 1000
        }}>
          <h2 style={{ marginBottom: '20px' }}>GAME OVER</h2>
          <button
            onClick={handleReturnToMenu}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid #ff0000',
              color: '#ff0000',
              padding: '10px 20px',
              fontSize: '16px',
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          >
            Return to Menu
          </button>
        </div>
      )}
    </div>
  );
};