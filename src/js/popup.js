import { startTimerUpdate } from './utils/timerUtils.js';

// Popup script for the Focus Mode extension

document.addEventListener("DOMContentLoaded", () => {
    const focusStatus = document.getElementById("focusStatus");
    const openSettingsButton = document.getElementById("openSettings");

    function updateFocusStatus() {
        chrome.storage.local.get(["isInFocusMode", "focusEndTime"], (result) => {
            if (result.isInFocusMode && result.focusEndTime) {
                const timeLeft = Math.max(0, Math.floor((result.focusEndTime - Date.now()) / 1000));
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                focusStatus.textContent = `Focus mode is running... Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                focusStatus.classList.remove("text-red-500");
                focusStatus.classList.add("text-green-500");
                if (timeLeft > 0) {
                    focusStatus.textContent = `Focus mode is running... Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                    focusStatus.classList.remove("text-red-500");
                    focusStatus.classList.add("text-green-500");
                } else {
                    focusStatus.textContent = "Focus mode ended.";
                    focusStatus.classList.remove("text-green-500");
                    focusStatus.classList.add("text-red-500");
                }
            } else {
                focusStatus.textContent = "";
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
    setInterval(updateTimer, 1000);
    updateTimer(); // Initial call to set the status immediately
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
                chrome.storage.local.set({ isInFocusMode: true, focusEndTime: Date.now() + focusDuration * 60 * 1000 });
                if (response && response.success) {
                    console.log("Focus mode started");
                    chrome.storage.local.set({ isInFocusMode: true, focusEndTime: Date.now() + focusDuration * 60 * 1000 }, () => {
                        updateFocusStatus(); // Update the status immediately
                    });
                    let timeLeft = focusDuration * 60; // Convert minutes to seconds

                    const timerInterval = setInterval(() => {
                        timeLeft--;
                        const minutes = Math.floor(timeLeft / 60);
                        const seconds = timeLeft % 60;
                        focusStatus.textContent = `Focus mode is running... Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;

                        if (timeLeft <= 0) {
                            clearInterval(timerInterval);
                            focusStatus.textContent = "Focus mode ended.";
                            chrome.storage.local.set({ isInFocusMode: false });
                        }
                    }, 1000);
                    focusStatus.classList.remove("text-red-500");
                    focusStatus.classList.add("text-green-500");
                } else {
                    console.error("Failed to start focus mode");
                    focusStatus.textContent = "Failed to start focus mode.";
                }
            });
        });
    }
});
