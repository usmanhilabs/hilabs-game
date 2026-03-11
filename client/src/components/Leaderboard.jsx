import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

const Leaderboard = ({ currentPlayer, onBack }) => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/leaderboard`)
            .then(res => res.json())
            .then(data => setLeaders(data))
            .catch(err => console.error("Failed to load leaderboard", err));
    }, []);

    return (
        <div className="container" style={{ animation: 'slideInRight 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img src="/HiLabs_All_White_logo.png" alt="HiLabs Logo" style={{ maxWidth: '120px', margin: '0 auto' }} />
            </div>
            <h1>🏆 Top Data Cleaners</h1>
            <p className="subtitle" style={{ marginBottom: '2rem' }}>HiLabs AI Challenge</p>

            <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                padding: 'clamp(1rem, 3vh, 2rem)',
                marginBottom: 'clamp(1rem, 3vh, 2rem)',
                maxHeight: '45vh',
                overflowY: 'auto'
            }}>
                {leaders.length === 0 ? (
                    <p className="text-center" style={{ color: 'var(--color-text-muted)' }}>No scores yet. Be the first!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {leaders.map((player, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: player.name === currentPlayer ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
                                    border: player.name === currentPlayer ? '1px solid var(--color-blue)' : '1px solid transparent',
                                    borderRadius: '8px',
                                    fontFamily: 'var(--font-mono)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{
                                        color: idx < 3 ? 'var(--color-orange)' : 'var(--color-text-muted)',
                                        fontWeight: idx < 3 ? 'bold' : 'normal',
                                        fontSize: '1.2rem',
                                        width: '30px',
                                        textAlign: 'right'
                                    }}>
                                        #{idx + 1}
                                    </span>
                                    <span style={{
                                        fontSize: '1.2rem',
                                        color: player.name === currentPlayer ? 'white' : 'inherit',
                                        fontWeight: player.name === currentPlayer ? 'bold' : 'normal'
                                    }}>
                                        {player.name}
                                    </span>
                                </div>
                                <span style={{
                                    color: 'var(--color-blue)',
                                    fontWeight: 'bold',
                                    fontSize: '1.4rem'
                                }}>
                                    {player.score}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button onClick={onBack} className="btn">
                Return to Start (Press N)
            </button>
        </div>
    );
};

export default Leaderboard;
