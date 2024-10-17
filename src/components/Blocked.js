import React, { useEffect, useState } from 'react';

const Blocked = () => {
    const [quote, setQuote] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(0);

    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Believe you can and you're halfway there. - Theodore Roosevelt",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "Strive not to be a success, but rather to be of value. - Albert Einstein",
        "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
        "Do what you can, with what you have, where you are. - Theodore Roosevelt",
        "Everything you've ever wanted is on the other side of fear. - George Addair",
        "The way to get started is to quit talking and begin doing. - Walt Disney",
        "Don't watch the clock; do what it does. Keep going. - Sam Levenson"
    ];

    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        const timerElement = document.getElementById('focus-timer');
        startTimerUpdate(1000, timerElement);
    }, []);

    const startTimerUpdate = (interval) => {
        const update = () => {
            chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
                if (response && response.timeRemaining !== undefined) {
                    setTimeRemaining(response.timeRemaining);
                }
            });
        };
        update();
        return setInterval(update, interval);
    };

    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen" style={{ backgroundColor: '#e4eaf1' }}>
            <div className="rounded-lg shadow-md p-8 text-center max-w-md">
                <h1 className="text-3xl font-bold text-green-500 mb-4">Site Blocked</h1>
                <p className="text-gray-700 mb-6">This site is currently blocked to help you stay focused.</p>
                <div id="focus-timer" className="text-2xl font-bold text-green-500 mb-6">
                    <p>Focus Mode is not running. Time left: <span>{formatTimeRemaining(timeRemaining)}</span></p>
                </div>
                <p className="text-gray-600 italic">{quote}</p>
            </div>
        </div>
    );
};

const formatTimeRemaining = (timeRemaining) => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default Blocked;
