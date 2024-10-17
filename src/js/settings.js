import { formatTimeRemaining } from './utils/timerUtils.js';

document.addEventListener('DOMContentLoaded', function() {
    const focusStatus = document.getElementById('focusStatus');
    const stopFocusModeButton = document.getElementById('stopFocusMode');
    const addSiteButton = document.getElementById('addSite');
    const newSiteInput = document.getElementById('newSite');
    const blockedSitesList = document.getElementById('blockedSitesList');
    const defaultFocusDurationInput = document.getElementById('defaultFocusDuration');
    const saveSettingsButton = document.getElementById('saveSettings');

    function updateFocusStatus() {
        chrome.storage.local.get(["isInFocusMode", "focusEndTime"], ({ isInFocusMode, focusEndTime }) => {
            const timeLeft = isInFocusMode && focusEndTime ? Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000)) : 0;
            const timeRemainingElement = document.getElementById('timeRemaining');
            const focusModeStatusElement = document.getElementById('focusModeStatus');
            if (timeRemainingElement && focusModeStatusElement) {
                timeRemainingElement.textContent = formatTimeRemaining(timeLeft);
                focusModeStatusElement.textContent = timeLeft > 0 
                    ? `Focus mode is running... Time left: ${formatTimeRemaining(timeLeft)}` 
                    : "Focus mode is not running.";
                focusStatus.classList.toggle("text-green-500", timeLeft > 0);
                focusStatus.classList.toggle("text-red-500", timeLeft <= 0);
            }
        });
    }

    stopFocusModeButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "endFocusMode" }, (response) => {
            if (response && response.success) {
                focusStatus.textContent = "Focus mode is not running.";
                updateFocusStatus();
            }
        });
    });

    addSiteButton.addEventListener('click', function() {
        const newSite = newSiteInput.value.trim();
        if (newSite) {
            addBlockedSite(newSite);
            newSiteInput.value = '';
            saveBlockedSites();
        }
    });

    saveSettingsButton.addEventListener('click', saveSettings);

    function addBlockedSite(site) {
        const li = document.createElement('li');
        li.textContent = site + ' ';
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'ml-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600';
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

    function saveSettings() {
        const defaultFocusDuration = parseInt(defaultFocusDurationInput.value, 10);
        if (isNaN(defaultFocusDuration) || defaultFocusDuration <= 0) {
            alert('Please enter a valid focus duration.');
            return;
        }

        const settings = {
            defaultFocusDuration: defaultFocusDuration,
            blockedSites: Array.from(blockedSitesList.children).map(li => li.textContent.replace('Remove', '').trim())
        };
        chrome.storage.sync.set(settings, function() {
            alert('Settings saved successfully!');
        });
    }

    setInterval(updateFocusStatus, 1000);
    updateFocusStatus(); // Initial call to set the status immediately
});
