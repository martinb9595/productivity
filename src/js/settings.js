import { startTimerUpdate, formatTimeRemaining } from '../utils/timerUtils.js';

document.addEventListener('DOMContentLoaded', function() {
    const focusStatus = document.getElementById('focusStatus');
    function updateFocusStatus() {
        chrome.storage.local.get(["isInFocusMode", "focusEndTime"], ({ isInFocusMode, focusEndTime }) => {
            if (isInFocusMode && focusEndTime) {
                const timeLeft = Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000));
                focusStatus.textContent = timeLeft > 0 
                    ? `Focus mode is running... Time left: ${formatTimeRemaining(timeLeft)}` 
                    : "Focus mode ended.";
                focusStatus.classList.toggle("text-green-500", timeLeft > 0);
                focusStatus.classList.toggle("text-red-500", timeLeft <= 0);
            } else {
                focusStatus.textContent = "Focus mode is not running.";
            }
        });
    }

    const stopFocusModeButton = document.getElementById('stopFocusMode');

    function toggleStopButton(isInFocusMode) {
        if (isInFocusMode) {
            stopFocusModeButton.style.display = 'block';
        } else {
            stopFocusModeButton.style.display = 'none';
        }
    }

    stopFocusModeButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "endFocusMode" }, (response) => {
            if (response && response.success) {
                focusStatus.textContent = "Focus mode is not running.";
                toggleStopButton(false);
                chrome.runtime.sendMessage({ action: "updatePopup" });
            }
        });
    });


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
