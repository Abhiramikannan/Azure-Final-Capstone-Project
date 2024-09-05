import React, { useState } from 'react';
import './Quiz.css'; // Ensure this file exists and is properly linked

const Quiz = () => {
    const [questions] = useState([
        {
            question: 'What is Bitcoin?',
            correct_answer: 'A cryptocurrency',
            incorrect_answers: ['A stock', 'A commodity', 'A bond']
        },
        {
            question: 'What is Ethereum?',
            correct_answer: 'A blockchain platform',
            incorrect_answers: ['A cryptocurrency', 'A company', 'A stock']
        },
        {
            question: 'What does DeFi stand for?',
            correct_answer: 'Decentralized Finance',
            incorrect_answers: ['Decentralized Fundraising', 'Distributed Finance', 'Digital Finance']
        },
        {
            question: 'What is a Smart Contract?',
            correct_answer: 'Self-executing contract with the terms directly written into code',
            incorrect_answers: ['A physical contract', 'A traditional legal contract', 'A digital agreement']
        },
        {
            question: 'What is an NFT?',
            correct_answer: 'Non-Fungible Token',
            incorrect_answers: ['Non-Financial Token', 'Non-Fungible Transfer', 'New Financial Token']
        },
        {
            question: 'What is a blockchain?',
            correct_answer: 'A decentralized digital ledger',
            incorrect_answers: ['A type of database', 'A form of encryption', 'A digital currency']
        },
        {
            question: 'Who created Bitcoin?',
            correct_answer: 'Satoshi Nakamoto',
            incorrect_answers: ['Vitalik Buterin', 'Elon Musk', 'Charlie Lee']
        },
        {
            question: 'What is a cryptocurrency wallet?',
            correct_answer: 'A digital tool for storing and managing cryptocurrency',
            incorrect_answers: ['A physical safe', 'A bank account', 'A trading platform']
        },
        {
            question: 'What does ICO stand for?',
            correct_answer: 'Initial Coin Offering',
            incorrect_answers: ['International Coin Order', 'Initial Crypto Offering', 'Investment Coin Opportunity']
        },
        {
            question: 'What is a mining pool?',
            correct_answer: 'A group of miners who share their processing power',
            incorrect_answers: ['A hardware device', 'A software application', 'A cryptocurrency exchange']
        }
    ]);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showScore, setShowScore] = useState(false);

    const handleAnswerOptionClick = (answer) => {
        setUserAnswers([...userAnswers, answer]);

        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
        } else {
            setShowScore(true);
        }
    };

    const calculateScore = () => {
        return userAnswers.reduce((score, answer, index) => {
            if (answer === questions[index].correct_answer) {
                return score + 1;
            }
            return score;
        }, 0);
    };

    return (
        <div className='quiz-container'>
            {showScore ? (
                <div className='score-section'>
                    <h2>Your Score</h2>
                    <p>You scored {calculateScore()} out of {questions.length}</p>
                </div>
            ) : (
                questions.length > 0 && (
                    <>
                        <div className='question-section'>
                            <div className='question-count'>
                                <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
                            </div>
                            <div className='question-text'>
                                {questions[currentQuestionIndex].question}
                            </div>
                        </div>
                        <div className='answer-section'>
                            {questions[currentQuestionIndex].incorrect_answers
                                .concat(questions[currentQuestionIndex].correct_answer)
                                .sort(() => Math.random() - 0.5)
                                .map((answer, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerOptionClick(answer)}
                                    >
                                        {answer}
                                    </button>
                                ))}
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default Quiz;
