import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

const LiveLeaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    const fetchLeaderboard = () => {
        fetch(`${API_URL}/leaderboard`)
            .then(res => res.json())
            .then(data => setLeaders(data))
            .catch(err => console.error("Failed to load leaderboard", err));
    };

    // Auto-refresh every 5 seconds
    useEffect(() => {
        fetchLeaderboard();
        const intervalId = setInterval(fetchLeaderboard, 5000);
        return () => clearInterval(intervalId); // Cleanup
    }, []);

    return (
        <div className="container" style={{
            animation: 'fadeIn 0.5s ease-out',
            maxWidth: '1200px',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img src="/HiLabs_All_White_logo.png" alt="HiLabs Logo" style={{ maxWidth: '200px', margin: '0 auto' }} />
            </div>

            <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🏆 LIVE STANDINGS</h1>
            <p className="subtitle" style={{ fontSize: '1.8rem', color: 'var(--color-orange)', marginBottom: '3rem' }}>
                {import.meta.env.VITE_GAME_SUBTITLE || 'Data Cleaning Challenge'}
            </p>

            <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '16px',
                padding: '2rem',
                flexGrow: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem',
                alignContent: 'start'
            }}>
                {leaders.length === 0 ? (
                    <p className="text-center" style={{ color: 'var(--color-text-muted)', fontSize: '2rem', gridColumn: '1 / -1' }}>
                        Waiting for first players...
                    </p>
                ) : (
                    leaders.slice(0, 15).map((player, idx) => (
                        <div
                            key={`${player.name}-${player.timestamp}`}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.5rem',
                                background: idx === 0 ? 'rgba(242, 107, 33, 0.2)' : 'rgba(26, 42, 66, 0.7)',
                                border: idx === 0 ? '2px solid var(--color-orange)' : '1px solid var(--color-navy-light)',
                                borderRadius: '12px',
                                fontFamily: 'var(--font-mono)',
                                animation: 'slideInRight 0.5s ease-out'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <span style={{
                                    color: idx === 0 ? 'var(--color-orange)' : (idx < 3 ? 'var(--color-blue)' : 'var(--color-text-muted)'),
                                    fontWeight: 'bold',
                                    fontSize: '2rem',
                                    width: '40px',
                                    textAlign: 'right'
                                }}>
                                    #{idx + 1}
                                </span>
                                <span style={{
                                    fontSize: '1.8rem',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '200px'
                                }}>
                                    {player.name}
                                </span>
                            </div>
                            <span style={{
                                color: idx === 0 ? 'var(--color-orange)' : 'var(--color-blue)',
                                fontWeight: '900',
                                fontSize: '2.5rem'
                            }}>
                                {player.score}
                            </span>
                        </div>
                    ))
                )}
            </div>

            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-muted)' }}>
                Auto-updating every 5 seconds...
            </p>
        </div>
    );
};

export default LiveLeaderboard;
