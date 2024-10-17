import { startTimerUpdate, formatTimeRemaining } from './utils/timerUtils.js';

// Popup script for the Focus Mode extension

document.addEventListener("DOMContentLoaded", () => {
    const focusStatus = document.getElementById("focusStatus");
    const openSettingsButton = document.getElementById("openSettings");

    function updateFocusStatus() {
        chrome.runtime.sendMessage({ action: "getTimerStatus" }, ({ timeRemaining }) => {
            const focusModeStatusElement = document.getElementById('focusModeStatus');
            const timeRemainingElement = document.getElementById('timeRemaining');
            if (focusModeStatusElement && timeRemainingElement) {
                focusModeStatusElement.textContent = timeRemaining > 0 
                    ? `Focus mode is running... Time left: ${formatTimeRemaining(timeRemaining)}` 
                    : "Focus mode is not running.";
                timeRemainingElement.textContent = formatTimeRemaining(timeRemaining);
                focusStatus.classList.toggle("text-green-500", timeRemaining > 0);
                focusStatus.classList.toggle("text-red-500", timeRemaining <= 0);
                focusStatus.style.display = "block";
            } else {
                focusStatus.textContent = "Focus mode is not running.";
                focusStatus.classList.remove("text-green-500");
                focusStatus.classList.add("text-red-500");
                focusStatus.style.display = "block";
            }
        });
    }

    const timerElement = document.getElementById("focusStatus");

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

    function updateTimer() {
        chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
            if (response && response.timeRemaining !== undefined) {
                const minutes = Math.floor(response.timeRemaining / 60);
                const seconds = response.timeRemaining % 60;
                timerElement.textContent = `Focus mode is running... Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                timerElement.classList.remove("text-red-500");
                timerElement.classList.add("text-green-500");
            } else {
                timerElement.textContent = "Focus mode is not running.";
                timerElement.classList.remove("text-green-500");
                timerElement.classList.add("text-red-500");
            }
        });
    }

    // Update the timer every second
    updateTimer(); // Initial call to set the status immediately
    setInterval(updateTimer, 1000);
    if (openSettingsButton) {
        openSettingsButton.addEventListener('click', function () {
            chrome.tabs.create({ url: chrome.runtime.getURL("src/html/settings.html") });
        });
    }

    const toggleFocusButton = document.getElementById("toggleFocus");
    if (toggleFocusButton) {
        toggleFocusButton.addEventListener("click", () => {
            const focusDurationInput = document.getElementById("focusDuration");
            const focusStatus = document.getElementById("focusStatus");
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
