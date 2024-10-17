
// Popup script for the Focus Mode extension

document.addEventListener("DOMContentLoaded", () => {
    const openSettingsButton = document.getElementById("openSettings");
    if (openSettingsButton) {
        openSettingsButton.addEventListener('click', function() {
            chrome.tabs.create({ url: chrome.runtime.getURL("src/html/settings.html") });
        });
    }

    const toggleFocusButton = document.getElementById("toggleFocus");
    if (toggleFocusButton) {
        toggleFocusButton.addEventListener("click", () => {
            const focusDuration = parseInt(document.getElementById("focusDuration").value, 10) || 25;
            chrome.runtime.sendMessage({ action: "startFocusMode", duration: focusDuration }, (response) => {
                if (response && response.success) {
                    console.log("Focus mode started");
                    // Optionally, update the UI to reflect the focus mode state
                } else {
                    console.error("Failed to start focus mode");
                }
            });
        });
    }
});
