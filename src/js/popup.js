// Popup script for the Focus Mode extension

// Popup script for the Focus Mode extension

document.getElementById('openSettings').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
});

document.getElementById('openOptions').addEventListener('click', function() {
    window.location.href = chrome.runtime.getURL("src/html/settings.html");
});

document.getElementById('openSettingsPage').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
});

document.getElementById('openSettingsButton').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
});

document.getElementById('openSettingsHtml').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
});
document.addEventListener("DOMContentLoaded", () => {
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
