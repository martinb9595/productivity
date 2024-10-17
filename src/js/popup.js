
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
            } else {
                focusStatus.textContent = "";
            }
        });
    }

    // Update the focus status every second
    setInterval(updateFocusStatus, 1000);
    updateFocusStatus(); // Initial call to set the status immediately
    if (openSettingsButton) {
        openSettingsButton.addEventListener('click', function () {
            window.location.href = "src/html/settings.html";
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
                    focusStatus.textContent = "Focus mode is running... Time left: " + focusDuration + ":00";
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
