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

export { updateTimerDisplay };
