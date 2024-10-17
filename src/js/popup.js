import { startTimerUpdate, formatTimeRemaining } from './utils/timerUtils.js';

// Popup script for the Focus Mode extension

document.addEventListener("DOMContentLoaded", () => {
    const focusStatus = document.getElementById("focusStatus");
    const openSettingsButton = document.getElementById("openSettings");
    const toggleFocusButton = document.getElementById("toggleFocus");
    const timerElement = document.getElementById("focusModeStatus");
    const timeRemainingElement = document.getElementById("timeRemaining");

    function updateFocusStatus() {
        chrome.runtime.sendMessage({ action: "getTimerStatus" }, ({ timeRemaining }) => {
            if (timeRemainingElement && timerElement) {
                timerElement.textContent = timeRemaining > 0 
                    ? `Focus mode is running... Time left: ${formatTimeRemaining(timeRemaining)}` 
                    : "Focus mode is not running.";
                timeRemainingElement.textContent = formatTimeRemaining(timeRemaining);
                focusStatus.classList.toggle("text-green-500", timeRemaining > 0);
                focusStatus.classList.toggle("text-red-500", timeRemaining <= 0);
                focusStatus.style.display = "block";
            }
        });
    }

    // Listen for timer updates from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "updateTimer") {
            const minutes = Math.floor(request.timeRemaining / 60);
            const seconds = request.timeRemaining % 60;
            timerElement.textContent = `Focus mode is running... Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            timerElement.classList.remove("text-red-500");
            timerElement.classList.add("text-green-500");
        }
    });

    // Update the timer every second
    updateFocusStatus(); // Initial call to set the status immediately
    setInterval(updateFocusStatus, 1000);

    if (openSettingsButton) {
        openSettingsButton.addEventListener('click', function () {
            chrome.tabs.create({ url: chrome.runtime.getURL("src/html/settings.html") });
        });
    }

    if (toggleFocusButton) {
        toggleFocusButton.addEventListener("click", () => {
            const focusDurationInput = document.getElementById("focusDuration");
            const focusDuration = parseInt(focusDurationInput.value, 10);

            if (isNaN(focusDuration) || focusDuration <= 0) {
                focusStatus.textContent = "Please enter a valid focus duration.";
                return;
            }

            chrome.runtime.sendMessage({ action: "startFocusMode", duration: focusDuration }, (response) => {
                if (response && response.success) {
                    console.log("Focus mode started");
                    chrome.storage.local.set({ isInFocusMode: true, focusEndTime: Date.now() + focusDuration * 60 * 1000 }, () => {
                        updateFocusStatus(); // Update the status immediately
                    });
                } else {
                    console.error("Failed to start focus mode");
                    focusStatus.textContent = "Failed to start focus mode.";
                }
            });
        });
    }
});
