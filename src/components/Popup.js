import React, { useEffect, useState } from 'react';
import { formatTimeRemaining } from './utils/timerUtils';

const Popup = () => {
    const [focusDuration, setFocusDuration] = useState('');
    const [focusStatus, setFocusStatus] = useState('Focus Mode is not running.');
    const [timeRemaining, setTimeRemaining] = useState('00:00');

    useEffect(() => {
        const updateFocusStatus = () => {
            chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
                const timeLeft = response.timeRemaining;
                setTimeRemaining(formatTimeRemaining(timeLeft));
                setFocusStatus(timeLeft > 0 ? `Focus mode is running... Time left: ${formatTimeRemaining(timeLeft)}` : "Focus mode is not running.");
            });
        };

        const intervalId = setInterval(updateFocusStatus, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleStartFocusMode = () => {
        const duration = parseInt(focusDuration, 10);
        if (isNaN(duration) || duration <= 0) {
            setFocusStatus("Please enter a valid focus duration.");
            return;
        }

        chrome.runtime.sendMessage({ action: "startFocusMode", duration }, (response) => {
            if (response && response.success) {
                console.log("Focus mode started");
            } else {
                console.error("Failed to start focus mode");
                setFocusStatus("Failed to start focus mode.");
            }
        });
    };

    return (
        <main className="bg-gray-100 flex justify-center items-center h-screen" style={{ backgroundColor: '#e4eaf1' }}>
            <div className="rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6">Focus Mode</h1>
                <input
                    type="number"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(e.target.value)}
                    placeholder="Focus Duration (minutes)"
                    min="1"
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
                <div className="space-y-4">
                    <button onClick={handleStartFocusMode} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">Start Focus Mode</button>
                </div>
                <div id="focusStatus" role="status" aria-live="polite" className="mt-4 text-center">
                    <p className="text-gray-700">{focusStatus} Time left: <span id="timeRemaining">{timeRemaining}</span></p>
                </div>
            </div>
        </main>
    );
};

export default Popup;
