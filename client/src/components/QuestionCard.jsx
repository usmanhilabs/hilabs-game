import React, { useState, useEffect } from 'react';

const QuestionCard = ({ question, onAnswer }) => {
    const [flashStatus, setFlashStatus] = useState(null); // 'success' or 'error'

    // Reset flash status when question changes
    useEffect(() => {
        setFlashStatus(null);
    }, [question]);

    const handleOptionClick = (option) => {
        const isCorrect = option === question.answer;
        setFlashStatus(isCorrect ? 'success' : 'error');

        // Brief delay to show animation before moving to next question
        setTimeout(() => {
            onAnswer(isCorrect);
        }, 300);
    };

    if (!question) return <div>Loading...</div>;

    const getHeaders = (dataset) => {
        if (!dataset || dataset.length === 0) return [];
        // Just numerical columns since we don't have header data in our simple JSON
        // Actually, in the spec it shows headers. We can hardcode based on column count or just use "Col 1", "Col 2"
        // Let's use generic ones
        return dataset[0].map((_, i) => `Column ${i + 1}`);
    };

    return (
        <div
            className="container"
            style={{
                animation: flashStatus === 'success' ? 'flash-success 0.3s ease' : flashStatus === 'error' ? 'flash-error 0.3s ease' : 'fadeIn 0.3s ease'
            }}
        >
            <table style={{ background: 'rgba(0,0,0,0.5)' }}>
                <tbody>
                    {question.dataset.map((row, rIdx) => (
                        <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                                <td key={cIdx}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '2rem' }}>{question.question}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        className="btn btn-secondary"
                        onClick={() => handleOptionClick(option)}
                        disabled={flashStatus !== null}
                        style={{
                            background: flashStatus !== null && option === question.answer ? 'var(--color-success)' : undefined,
                            color: flashStatus !== null && option === question.answer ? 'black' : undefined,
                        }}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;
