const updateTimerDisplay = (timeRemaining, timerElement) => {
    if (timerElement) {
        timerElement.textContent = timeRemaining > 0
            ? `Time remaining in focus mode: ${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`
            : 'Focus mode ended';
    }
};

const startTimerUpdate = (interval, timerElement) => {
    const update = () => {
        chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
            if (response && response.timeRemaining !== undefined) {
                updateTimerDisplay(response.timeRemaining, timerElement);
            }
        });
    };
    update();
    return setInterval(update, interval);
};

const formatTimeRemaining = (timeRemaining) => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export { updateTimerDisplay, startTimerUpdate, formatTimeRemaining };
