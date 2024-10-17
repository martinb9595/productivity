import { formatTimeRemaining } from './utils/timerUtils.js';

document.addEventListener('DOMContentLoaded', function() {
    const focusStatus = document.getElementById('focusStatus');
    const stopFocusModeButton = document.getElementById('stopFocusMode');

    function updateFocusStatus() {
        chrome.storage.local.get(["isInFocusMode", "focusEndTime"], ({ isInFocusMode, focusEndTime }) => {
            const timeLeft = isInFocusMode && focusEndTime ? Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000)) : 0;
            const timeRemainingElement = document.getElementById('timeRemaining');
            const focusModeStatusElement = document.getElementById('focusModeStatus');
            if (timeRemainingElement && focusModeStatusElement) {
                timeRemainingElement.textContent = formatTimeRemaining(timeLeft);
                focusModeStatusElement.textContent = timeLeft > 0 
                    ? `Focus mode is running... Time left: ${formatTimeRemaining(timeLeft)}` 
                    : "Focus mode is not running.";
                focusStatus.classList.toggle("text-green-500", timeLeft > 0);
                focusStatus.classList.toggle("text-red-500", timeLeft <= 0);
            }
        });
    }

    stopFocusModeButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "endFocusMode" }, (response) => {
            if (response && response.success) {
                focusStatus.textContent = "Focus mode is not running.";
                updateFocusStatus();
            }
        });
    });

    setInterval(updateFocusStatus, 1000);
    updateFocusStatus(); // Initial call to set the status immediately
});
