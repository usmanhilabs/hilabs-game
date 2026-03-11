import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

const API_URL = 'http://localhost:3001';
const ROUND_TIME = parseInt(import.meta.env.VITE_ROUND_TIME) || 30; // seconds

const Game = ({ playerName, onEnd }) => {
    const [round, setRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);

    const [round1Score, setRound1Score] = useState(0);
    const [round2Score, setRound2Score] = useState(0);

    const [showTransition, setShowTransition] = useState(true);

    // Fetch questions on round start
    useEffect(() => {
        fetch(`${API_URL}/questions/round${round}`)
            .then(res => res.json())
            .then(data => {
                // Simple shuffle
                const shuffled = data.sort(() => 0.5 - Math.random());
                setQuestions(shuffled);
                setCurrentQIndex(0);
                setTimeLeft(ROUND_TIME);
            })
            .catch(err => {
                console.error("Failed to load questions", err);
                setQuestions([]);
            });

        // Hide transition screen after a delay
        const transitionTimer = setTimeout(() => {
            setShowTransition(false);
        }, 2500);

        return () => clearTimeout(transitionTimer);
    }, [round]);

    // Timer logic
    useEffect(() => {
        let timerId;

        // Only tick down if we are NOT in transition and there is time left
        if (!showTransition && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (!showTransition && timeLeft <= 0) {
            // End the round exactly when timer hits 0 and we aren't transitioning
            handleRoundEnd();
        }

        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [timeLeft, showTransition]);

    const handleRoundEnd = () => {
        if (round === 1) {
            setShowTransition(true);
            setRound(2); // Start round 2
            setTimeLeft(ROUND_TIME); // Reset timer explicitly for round 2
        } else {
            // Game over
            onEnd(round1Score, round2Score);
        }
    };

    const currentScore = round === 1 ? round1Score : round2Score;

    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            const points = round === 1 ? 10 : 15;
            if (round === 1) setRound1Score(prev => prev + points);
            if (round === 2) setRound2Score(prev => prev + points);
        }

        // Move to next question, loop back to start if we run out
        setCurrentQIndex(prev => (prev + 1) % questions.length);
    };

    if (questions.length === 0) {
        return <div className="container" style={{ textAlign: 'center' }}>Loading Datasets...</div>;
    }

    if (showTransition) {
        return (
            <div className="container" style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'white' }}>
                    {round === 1 ? 'Get Ready!' : 'Round 1 Complete!'}
                </h1>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--color-orange)', animation: 'pulse-glow 1.5s infinite alternate' }}>
                    {round === 1 ? 'Starting Round 1...' : 'Starting Round 2...'}
                </h2>
                <div style={{ marginTop: '2rem', fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                    {round === 1
                        ? (import.meta.env.VITE_ROUND1_TITLE || 'Fix The Dataset')
                        : (import.meta.env.VITE_ROUND2_TITLE || 'Beat the AI')}
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQIndex];

    return (
        <div style={{ width: '100%', maxWidth: '900px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '1rem 2rem',
                background: 'rgba(26,42,66,0.8)',
                borderRadius: '12px',
                border: '1px solid var(--color-navy-light)'
            }}>
                <div>
                    <h2 style={{ margin: 0, textAlign: 'left', color: 'white' }}>
                        Round {round}: {round === 1 ? (import.meta.env.VITE_ROUND1_TITLE || 'Fix The Dataset') : (import.meta.env.VITE_ROUND2_TITLE || 'Beat the AI')}
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Player: <span style={{ color: 'var(--color-blue)' }}>{playerName}</span>
                    </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: timeLeft <= 5 ? 'var(--color-error)' : 'white'
                    }}>
                        {timeLeft}s
                    </div>
                    <div style={{ color: 'var(--color-orange)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Score: {currentScore}
                    </div>
                </div>
            </div>

            {/* Progress bar container */}
            <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255,255,255,0.1)',
                marginBottom: '2rem',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${(timeLeft / ROUND_TIME) * 100}%`,
                    background: timeLeft <= 5 ? 'var(--color-error)' : 'var(--color-blue)',
                    transition: 'width 1s linear, background 0.3s'
                }}></div>
            </div>

            <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
            />
        </div>
    );
};

export default Game;
