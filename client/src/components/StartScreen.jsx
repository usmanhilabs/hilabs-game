import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001';

const StartScreen = ({ onStart, onViewLeaderboard }) => {
    const [name, setName] = useState('');
    const [topPlayers, setTopPlayers] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/leaderboard`)
            .then(res => res.json())
            .then(data => setTopPlayers(data.slice(0, 5)))
            .catch(err => console.error("Failed to fetch leaderboard", err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onStart(name.trim());
        }
    };

    return (
        <div className="container" style={{ animation: 'slideInRight 0.5s ease-out' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Beat the AI</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Data Cleaning Challenge</h2>

            <p className="subtitle">Can you clean data faster than AI?</p>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '1.2rem' }}>+10 Points</span> for correct answers
                </div>
                <div>
                    <span style={{ color: 'var(--color-error)', fontWeight: 'bold', fontSize: '1.2rem' }}>-5 Points and -3 Seconds</span> for wrong answers
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
                <input
                    type="text"
                    placeholder="Enter your name to start..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    maxLength={20}
                />
                <button type="submit" className="btn" disabled={!name.trim()}>
                    Start Game
                </button>
            </form>

            {topPlayers.length > 0 && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                    <h3 style={{ color: 'var(--color-blue)', marginBottom: '1rem', textAlign: 'center' }}>🏆 Top Players Today</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {topPlayers.map((player, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
                                <span><span style={{ color: 'var(--color-text-muted)', marginRight: '1rem' }}>{idx + 1}.</span>{player.name}</span>
                                <span style={{ color: 'var(--color-orange)', fontWeight: 'bold' }}>{player.score}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ marginTop: '1.5rem', padding: '0.8rem', fontSize: '1.2rem' }}
                        onClick={onViewLeaderboard}
                    >
                        View Full Leaderboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default StartScreen;
