// Options script for the Focus Mode extension

// Options script for the Focus Mode extension

document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        blockedSitesList: document.getElementById('blockedSitesList'),
        newSiteInput: document.getElementById('newSite'),
        addSiteButton: document.getElementById('addSite'),
        defaultFocusDurationInput: document.getElementById('defaultFocusDuration'),
        saveSettingsButton: document.getElementById('saveSettings')
    };

    // Load saved settings
    chrome.storage.sync.get(['blockedSites', 'defaultFocusDuration'], function(result) {
        if (result.blockedSites) {
            result.blockedSites.forEach(site => addBlockedSite(site));
        }
        if (result.defaultFocusDuration) {
            elements.defaultFocusDurationInput.value = result.defaultFocusDuration;
        }
        chrome.storage.sync.set({ defaultFocusDuration: elements.defaultFocusDurationInput.value }, function() {
            chrome.runtime.sendMessage({ action: "updateDefaultFocusDuration", duration: elements.defaultFocusDurationInput.value });
        });
    });

    elements.addSiteButton.addEventListener('click', function () {
        const newSite = elements.newSiteInput.value.trim();
        if (newSite) {
            addBlockedSite(newSite);
            elements.newSiteInput.value = '';
            saveBlockedSites();
        }
    });

    elements.saveSettingsButton.addEventListener('click', saveSettings);

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
        elements.blockedSitesList.appendChild(li);
    }

    function saveBlockedSites() {
        const sites = Array.from(elements.blockedSitesList.children).map(li => li.textContent.replace('Remove', '').trim());
        chrome.storage.sync.set({blockedSites: sites});
    }

    function saveSettings() {
        const defaultFocusDuration = parseInt(elements.defaultFocusDurationInput.value, 10);
        if (isNaN(defaultFocusDuration) || defaultFocusDuration <= 0) {
            alert('Please enter a valid focus duration.');
            return;
        }

        const settings = {
            defaultFocusDuration: defaultFocusDuration,
            blockedSites: Array.from(elements.blockedSitesList.children).map(li => li.textContent.replace('Remove', '').trim())
        };
        chrome.storage.sync.set(settings, function() {
            alert('Settings saved successfully!');
        });
    }

    function updateFocusModeStatus() {
        chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
            const minutes = Math.floor(response.timeRemaining / 60);
            const seconds = response.timeRemaining % 60;
            const timeRemainingElement = document.getElementById('timeRemaining');
            const focusModeStatusElement = document.getElementById('focusModeStatus');
            if (timeRemainingElement && focusModeStatusElement) {
                timeRemainingElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                if (response.timeRemaining > 0) {
                    focusModeStatusElement.textContent = `Focus Mode is running... Time left: ${timeRemainingElement.textContent}`;
                } else {
                    focusModeStatusElement.textContent = 'Focus Mode is not running. Time left: 00:00';
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        setInterval(updateFocusModeStatus, 1000);
    });
});
