// Popup script for the Focus Mode extension

// Popup script for the Focus Mode extension

document.getElementById('openSettings').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
});

document.getElementById('openOptions').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
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
    toggleFocusButton.addEventListener("click", () => {
        chrome.storage.sync.set({ isInFocusMode: true }, () => {
            console.log("Focus mode started");
            // Optionally, you can update the UI to reflect the focus mode state
        });
    });
});
