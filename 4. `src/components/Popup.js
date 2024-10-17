import React, { useState, useEffect } from 'react';
import { formatTimeRemaining } from '../utils';

const Popup = () => {
    const [isInFocusMode, setIsInFocusMode] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // Logic to update time remaining
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Focus Mode</h1>
            <p>{isInFocusMode ? `Time left: ${formatTimeRemaining(timeRemaining)}` : "Focus mode is not running."}</p>
            <button onClick={() => {/* Start focus mode logic */}}>Start Focus Mode</button>
        </div>
    );
};

export default Popup;
