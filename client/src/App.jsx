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
  const [round1Score, setRound1Score] = useState(0);
  const [round2Score, setRound2Score] = useState(0);

  // Global operator shortcut 'N' to reset game
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName.toLowerCase() === 'input') return;

      if (e.key.toLowerCase() === 'n') {
        e.preventDefault(); // <-- Prevent typing N into the newly instantly focused input field
        setGameState('START');
        setPlayerName('');
        setRound1Score(0);
        setRound2Score(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startGame = (name) => {
    setPlayerName(name);
    setRound1Score(0);
    setRound2Score(0);
    setGameState('PLAYING');
  };

  const handleGameEnd = (r1Score, r2Score) => {
    setRound1Score(r1Score);
    setRound2Score(r2Score);
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
              round1Score={round1Score}
              round2Score={round2Score}
              onViewLeaderboard={() => setGameState('LEADERBOARD')}
              onNextPlayer={() => {
                setGameState('START');
                setPlayerName('');
                setRound1Score(0);
                setRound2Score(0);
              }}
            />
          )}

          {gameState === 'LEADERBOARD' && (
            <Leaderboard
              currentPlayer={playerName}
              onBack={() => {
                setGameState('START');
                setPlayerName('');
                setRound1Score(0);
                setRound2Score(0);
              }}
            />
          )}
        </div>
      } />
    </Routes>
  );
}

export default App;
