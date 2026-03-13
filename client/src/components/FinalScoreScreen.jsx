import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';

const API_URL = 'http://localhost:3001';

const FinalScoreScreen = ({ playerName, score, onViewLeaderboard, onNextPlayer }) => {
    const [saved, setSaved] = useState(false);
    const [displayScore, setDisplayScore] = useState(0);
    const [isWinner, setIsWinner] = useState(false);
    const hasSavedRef = useRef(false);

    // Instant Win Threshold
    const WIN_THRESHOLD = parseInt(import.meta.env.VITE_WIN_THRESHOLD) || 200;

    useEffect(() => {
        // Count animation
        let current = 0;
        if (score === 0) {
            setDisplayScore(0);
            return;
        }
        const step = Math.ceil(Math.abs(score) / 20) || 1;
        const direction = score > 0 ? 1 : -1;
        const interval = setInterval(() => {
            current += step * direction;
            if ((direction > 0 && current >= score) || (direction < 0 && current <= score)) {
                current = score;
                clearInterval(interval);
            }
            setDisplayScore(current);
        }, 50);

        return () => clearInterval(interval);
    }, [score]);

    useEffect(() => {
        // Post to leaderboard
        if (!hasSavedRef.current) {
            hasSavedRef.current = true; // immediately block subsequent calls

            fetch(`${API_URL}/leaderboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: playerName, score: score })
            })
                .then(res => res.json())
                .then(data => {
                    setSaved(true);
                    if (score > 100) {
                        triggerConfetti();
                    }
                    if (score >= WIN_THRESHOLD) {
                        setIsWinner(true);
                    }
                })
                .catch(err => console.error("Failed to save score:", err));
        }
    }, [playerName, score, saved, WIN_THRESHOLD]);

    const triggerConfetti = () => {
        var end = Date.now() + (3 * 1000);
        var colors = ['#f26b21', '#00d2ff'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    return (
        <div className="container" style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img src="/HiLabs_All_White_logo.png" alt="HiLabs Logo" style={{ maxWidth: '120px', margin: '0 auto' }} />
            </div>
            <h1>Game Over</h1>
            <h2 style={{ color: 'white' }}>{playerName}'s Report</h2>

            <div style={{ margin: '3rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                    background: isWinner ? 'rgba(0, 210, 255, 0.1)' : 'rgba(0,0,0,0.3)',
                    border: isWinner ? '2px solid var(--color-blue)' : 'none',
                    boxShadow: isWinner ? 'var(--glow-blue)' : 'none',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    transition: 'all 0.5s ease'
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                        Final Score
                    </div>
                    <div style={{
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        color: isWinner ? 'var(--color-blue)' : 'var(--color-orange)',
                        textShadow: isWinner ? 'var(--glow-blue)' : 'var(--glow-orange)',
                        animation: displayScore === score ? 'countUp 0.5s ease' : 'none'
                    }}>
                        {displayScore}
                    </div>
                    {isWinner && (
                        <div style={{
                            marginTop: '1rem',
                            fontSize: '1.5rem',
                            color: 'var(--color-success)',
                            animation: 'flash-success 1s infinite alternate',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            🎉 INSTANT WINNER! CLAIM YOUR PRIZE! 🎉
                        </div>
                    )}
                </div>
            </div>

            <p style={{ color: 'var(--color-success)', marginBottom: '2rem', minHeight: '1.5rem' }}>
                {saved ? '✓ Successfully added to Leaderboard' : 'Saving...'}
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
                <button onClick={onViewLeaderboard} className="btn">
                    View Leaderboard
                </button>
                <button onClick={onNextPlayer} className="btn btn-secondary">
                    Play Next Player (Press N)
                </button>
            </div>
        </div>
    );
};

export default FinalScoreScreen;
