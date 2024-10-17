// Options script for the Focus Mode extension

// Options script for the Focus Mode extension

document.addEventListener('DOMContentLoaded', function() {
    const blockedSitesList = document.getElementById('blockedSitesList');
    const newSiteInput = document.getElementById('newSite');
    const addSiteButton = document.getElementById('addSite');
    const defaultFocusDurationInput = document.getElementById('defaultFocusDuration');
    const saveSettingsButton = document.getElementById('saveSettings');

    // Load saved settings
    chrome.storage.sync.get(['blockedSites', 'defaultFocusDuration'], function(result) {
        if (result.blockedSites) {
            result.blockedSites.forEach(site => addBlockedSite(site));
        }
        if (result.defaultFocusDuration) {
            defaultFocusDurationInput.value = result.defaultFocusDuration;
        }
        chrome.storage.sync.set({ defaultFocusDuration: defaultFocusDurationInput.value }, function() {
            chrome.runtime.sendMessage({ action: "updateDefaultFocusDuration", duration: defaultFocusDurationInput.value });
        });
    });

    addSiteButton.addEventListener('click', function () {
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
});
