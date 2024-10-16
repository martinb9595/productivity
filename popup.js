document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleFocus');
    const timerDisplay = document.getElementById('timer');
    const timeLeft = document.getElementById('time-left');
    const focusDurationInput = document.getElementById('focusDuration');
    const newSiteInput = document.getElementById('newSite');
    const addSiteButton = document.getElementById('addSite');
    const blockedSitesList = document.getElementById('blockedSites');

    let isInFocusMode = false;

    // Load saved settings
    chrome.storage.sync.get(['blockedSites', 'focusDuration'], function(result) {
        if (result.blockedSites) {
            result.blockedSites.forEach(site => addBlockedSite(site));
        }
        if (result.focusDuration) {
            focusDurationInput.value = result.focusDuration;
        }
    });

    toggleButton.addEventListener('click', function() {
        isInFocusMode = !isInFocusMode;
        if (isInFocusMode) {
            startFocusMode();
        } else {
            endFocusMode();
        }
    });

    addSiteButton.addEventListener('click', function() {
        const newSite = newSiteInput.value.trim();
        if (newSite) {
            addBlockedSite(newSite);
            newSiteInput.value = '';
            saveBlockedSites();
        }
    });

    focusDurationInput.addEventListener('change', function() {
        chrome.storage.sync.set({focusDuration: focusDurationInput.value});
    });

    function startFocusMode() {
        toggleButton.textContent = 'End Focus Mode';
        timerDisplay.classList.remove('hidden');
        const duration = focusDurationInput.value * 60; // convert to seconds
        updateTimer(duration);
        chrome.runtime.sendMessage({action: 'startFocusMode', duration: duration});
    }

    function endFocusMode() {
        toggleButton.textContent = 'Start Focus Mode';
        timerDisplay.classList.add('hidden');
        chrome.runtime.sendMessage({action: 'endFocusMode'});
    }

    function updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeLeft.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function addBlockedSite(site) {
        const li = document.createElement('li');
        li.textContent = site;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
            li.remove();
            saveBlockedSites();
        });
        li.appendChild(removeButton);
        blockedSitesList.appendChild(li);
    }

    function saveBlockedSites() {
        const sites = Array.from(blockedSitesList.children).map(li => li.textContent.replace('Remove', '').trim());
        chrome.storage.sync.set({blockedSites: sites});
    }
});
