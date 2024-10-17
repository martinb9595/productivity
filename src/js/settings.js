import { startTimerUpdate, formatTimeRemaining } from './utils/timerUtils.js';

document.addEventListener('DOMContentLoaded', function() {
    const focusStatus = document.getElementById('focusStatus');
    function updateFocusStatus() {
        chrome.storage.local.get(["isInFocusMode", "focusEndTime"], (result) => {
            if (result.isInFocusMode && result.focusEndTime) {
                const timeLeft = Math.max(0, Math.floor((result.focusEndTime - Date.now()) / 1000));
                if (timeLeft > 0) {
                    focusStatus.textContent = `Focus mode is running... Time left: ${formatTimeRemaining(timeLeft)}`;
                    focusStatus.classList.remove("text-red-500");
                    focusStatus.classList.add("text-green-500");
                } else {
                    focusStatus.textContent = "Focus mode ended.";
                    focusStatus.classList.remove("text-green-500");
                    focusStatus.classList.add("text-red-500");
                }
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

    function updateFocusStatus() {
        chrome.storage.local.get(["isInFocusMode", "focusEndTime"], (result) => {
            if (result.isInFocusMode && result.focusEndTime) {
                const timeLeft = Math.max(0, Math.floor((result.focusEndTime - Date.now()) / 1000));
                if (timeLeft > 0) {
                    focusStatus.textContent = `Focus mode is running... Time left: ${formatTimeRemaining(timeLeft)}`;
                    focusStatus.classList.remove("text-red-500");
                    focusStatus.classList.add("text-green-500");
                    toggleStopButton(true);
                } else {
                    focusStatus.textContent = "Focus mode ended.";
                    focusStatus.classList.remove("text-green-500");
                    focusStatus.classList.add("text-red-500");
                    toggleStopButton(false);
                }
            } else {
                focusStatus.textContent = "Focus mode is not running.";
                toggleStopButton(false);
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
