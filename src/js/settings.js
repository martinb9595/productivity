import { startTimerUpdate, formatTimeRemaining } from './utils/timerUtils.js';

document.addEventListener('DOMContentLoaded', function() {
    const focusStatus = document.getElementById('focusStatus');
    function updateFocusStatus() {
        chrome.storage.local.get(["isInFocusMode", "focusEndTime"], (result) => {
            if (result.isInFocusMode && result.focusEndTime) {
                const timeLeft = Math.max(0, Math.floor((result.focusEndTime - Date.now()) / 1000));
                focusStatus.textContent = `Focus mode is running... Time left: ${formatTimeRemaining(timeLeft)}`;
                focusStatus.classList.remove("text-red-500");
                focusStatus.classList.add("text-green-500");
            } else {
                focusStatus.textContent = "Focus mode is not running.";
            }
        });
    }

    // Update the focus status every second
    setInterval(updateFocusStatus, 1000);
    updateFocusStatus(); // Initial call to set the status immediately

    // Sync settings
    const defaultFocusDurationInput = document.getElementById('defaultFocusDuration');
    chrome.storage.sync.get(['defaultFocusDuration'], function(result) {
        if (result.defaultFocusDuration) {
            defaultFocusDurationInput.value = result.defaultFocusDuration;
        }
    });

    defaultFocusDurationInput.addEventListener('change', function() {
        chrome.storage.sync.set({ defaultFocusDuration: defaultFocusDurationInput.value });
    });
});
