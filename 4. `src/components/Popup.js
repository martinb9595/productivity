import React, { useEffect, useState } from 'react';
import { formatTimeRemaining, startTimerUpdate } from '../utils';

const Popup = () => {
  const [focusMode, setFocusMode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch timer status from storage or background script
      chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
        if (response && response.timeRemaining !== undefined) {
          setTimeRemaining(response.timeRemaining);
          setFocusMode(response.timeRemaining > 0);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startFocusMode = (duration) => {
    chrome.runtime.sendMessage({ action: "startFocusMode", duration }, (response) => {
      if (response && response.success) {
        setFocusMode(true);
      }
    });
  };

  return (
    <div>
      <h1>Focus Mode</h1>
      <p>{focusMode ? `Time left: ${formatTimeRemaining(timeRemaining)}` : "Focus mode is not running."}</p>
      <button onClick={() => startFocusMode(25)}>Start Focus Mode</button>
    </div>
  );
};

export default Popup;
