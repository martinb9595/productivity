function updateTimerDisplay(timeRemaining, timerElement) {
    if (timerElement) {
        if (timeRemaining > 0) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerElement.textContent = `Time remaining in focus mode: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timerElement.textContent = 'Focus mode ended';
        }
    }
}

function startTimerUpdate(interval, timerElement) {
    function update() {
        chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
            if (response && response.timeRemaining !== undefined) {
                updateTimerDisplay(response.timeRemaining, timerElement);
            }
        });
    }
    update(); // Initial call
    return setInterval(update, interval);
}

function formatTimeRemaining(timeRemaining) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export { updateTimerDisplay, startTimerUpdate, formatTimeRemaining };
