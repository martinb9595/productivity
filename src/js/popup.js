// Popup script for the Focus Mode extension

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleFocus');
    const timerDisplay = document.getElementById('timer');
    const focusDurationInput = document.getElementById('focusDuration');

    chrome.storage.sync.get(['isInFocusMode', 'focusDuration'], function(result) {
        isInFocusMode = result.isInFocusMode || false;
        focusDurationInput.value = result.focusDuration || 25;
        updateUI();
    });

    toggleButton.addEventListener('click', function() {
        if (isInFocusMode) {
            endFocusMode();
        } else {
            startFocusMode();
        }
    });

    function startFocusMode() {
        const duration = focusDurationInput.value * 60; // convert to seconds
        chrome.runtime.sendMessage({action: 'startFocusMode', duration: duration});
        chrome.storage.sync.set({isInFocusMode: true, focusDuration: focusDurationInput.value});
        isInFocusMode = true;
        updateUI();
    }

    function endFocusMode() {
        chrome.runtime.sendMessage({action: 'endFocusMode'});
        chrome.storage.sync.set({isInFocusMode: false});
        isInFocusMode = false;
        updateUI();
    }

    function updateUI() {
        toggleButton.textContent = isInFocusMode ? 'End Focus Mode' : 'Start Focus Mode';
        timerDisplay.style.display = isInFocusMode ? 'block' : 'none';
    }

    function updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateTimer') {
            updateTimer(request.timeRemaining);
        }
    });
});
// Popup script for the Focus Mode extension

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleFocus');
    const timerDisplay = document.getElementById('timer');
    const focusDurationInput = document.getElementById('focusDuration');

    chrome.storage.sync.get(['isInFocusMode', 'focusDuration'], function(result) {
        isInFocusMode = result.isInFocusMode || false;
        focusDurationInput.value = result.focusDuration || 25;
        updateUI();
    });

    toggleButton.addEventListener('click', function() {
        if (isInFocusMode) {
            endFocusMode();
        } else {
            startFocusMode();
        }
    });

    function startFocusMode() {
        const duration = focusDurationInput.value * 60; // convert to seconds
        chrome.runtime.sendMessage({action: 'startFocusMode', duration: duration});
        chrome.storage.sync.set({isInFocusMode: true, focusDuration: focusDurationInput.value});
        isInFocusMode = true;
        updateUI();
    }

    function endFocusMode() {
        chrome.runtime.sendMessage({action: 'endFocusMode'});
        chrome.storage.sync.set({isInFocusMode: false});
        isInFocusMode = false;
        updateUI();
    }

    function updateUI() {
        toggleButton.textContent = isInFocusMode ? 'End Focus Mode' : 'Start Focus Mode';
        timerDisplay.style.display = isInFocusMode ? 'block' : 'none';
    }

    function updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateTimer') {
            updateTimer(request.timeRemaining);
        }
    });
});
