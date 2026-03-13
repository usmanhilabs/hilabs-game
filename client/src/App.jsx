import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import FinalScoreScreen from './components/FinalScoreScreen';
import Leaderboard from './components/Leaderboard';
import LiveLeaderboard from './components/LiveLeaderboard';
import './index.css';

function App() {
  const [gameState, setGameState] = useState('START'); // START, PLAYING, END, LEADERBOARD
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState(0);

  // Global operator shortcut 'N' to reset game
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName.toLowerCase() === 'input') return;

      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setGameState('START');
        setPlayerName('');
        setScore(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startGame = (name) => {
    setPlayerName(name);
    setScore(0);
    setGameState('PLAYING');
  };

  const handleGameEnd = (finalScore) => {
    setScore(finalScore);
    setGameState('END');
  };

  return (
    <Routes>
      <Route path="/leaderboard" element={<LiveLeaderboard />} />
      <Route path="/" element={
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {gameState === 'START' && (
            <StartScreen
              onStart={startGame}
              onViewLeaderboard={() => setGameState('LEADERBOARD')}
            />
          )}

          {gameState === 'PLAYING' && (
            <Game
              playerName={playerName}
              onEnd={handleGameEnd}
            />
          )}

          {gameState === 'END' && (
            <FinalScoreScreen
              playerName={playerName}
              score={score}
              onViewLeaderboard={() => setGameState('LEADERBOARD')}
              onNextPlayer={() => {
                setGameState('START');
                setPlayerName('');
                setScore(0);
              }}
            />
          )}

          {gameState === 'LEADERBOARD' && (
            <Leaderboard
              currentPlayer={playerName}
              onBack={() => {
                setGameState('START');
                setPlayerName('');
                setScore(0);
              }}
            />
          )}
        </div>
      } />
    </Routes>
  );
}

export default App;
