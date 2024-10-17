document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleFocus');
    const timerDisplay = document.getElementById('timer');
    const timeLeft = document.getElementById('time-left');
    const focusDurationInput = document.getElementById('focusDuration');
    const openOptionsButton = document.getElementById('openOptions');

    let isInFocusMode = false;

    // Load saved settings
    chrome.storage.sync.get(['focusDuration', 'isInFocusMode'], function(result) {
        if (result.focusDuration) {
            focusDurationInput.value = result.focusDuration;
        }
        if (result.isInFocusMode) {
            isInFocusMode = result.isInFocusMode;
            updateUI();
        }
    });

    toggleButton.addEventListener('click', function() {
        isInFocusMode = !isInFocusMode;
        updateUI();
        if (isInFocusMode) {
            startFocusMode();
        } else {
            endFocusMode();
        }
    });

    focusDurationInput.addEventListener('change', function() {
        chrome.storage.sync.set({focusDuration: focusDurationInput.value});
    });

    openOptionsButton.addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });

    function updateUI() {
        if (isInFocusMode) {
            toggleButton.textContent = 'End Focus Mode';
            timerDisplay.classList.remove('hidden');
        } else {
            toggleButton.textContent = 'Start Focus Mode';
            timerDisplay.classList.add('hidden');
        }
    }

    function startFocusMode() {
        const duration = focusDurationInput.value * 60; // convert to seconds
        updateTimer(duration);
        chrome.runtime.sendMessage({action: 'startFocusMode', duration: duration});
        chrome.storage.sync.set({isInFocusMode: true});
    }

    function endFocusMode() {
        chrome.runtime.sendMessage({action: 'endFocusMode'});
        chrome.storage.sync.set({isInFocusMode: false});
    }

    function updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeLeft.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateTimer') {
            updateTimer(request.timeRemaining);
        }
    });
});
