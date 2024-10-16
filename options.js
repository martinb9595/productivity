document.addEventListener('DOMContentLoaded', function() {
    const blockedSitesList = document.getElementById('blockedSites');
    const newSiteInput = document.getElementById('newSite');
    const addSiteButton = document.getElementById('addSite');
    const defaultFocusDurationInput = document.getElementById('defaultFocusDuration');
    const showQuotesCheckbox = document.getElementById('showQuotes');
    const saveSettingsButton = document.getElementById('saveSettings');

    // Load saved settings
    chrome.storage.sync.get(['blockedSites', 'defaultFocusDuration', 'showQuotes'], function(result) {
        if (result.blockedSites) {
            result.blockedSites.forEach(site => addBlockedSite(site));
        }
        if (result.defaultFocusDuration) {
            defaultFocusDurationInput.value = result.defaultFocusDuration;
        }
        if (result.showQuotes !== undefined) {
            showQuotesCheckbox.checked = result.showQuotes;
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

    saveSettingsButton.addEventListener('click', function() {
        saveSettings();
    });

    const upgradeToPremiumButton = document.getElementById('upgradeToPremium');
    upgradeToPremiumButton.addEventListener('click', function() {
        // Implement your payment logic here
        alert('Redirecting to payment page...');
        // You would typically redirect to a payment processor or your own payment page
    });

    const donateButton = document.getElementById('donateButton');
    donateButton.addEventListener('click', function() {
        // Implement your donation logic here
        alert('Redirecting to donation page...');
        // You would typically redirect to a donation service or your own donation page
    });

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
        chrome.storage.sync.get(['isPremium'], function(result) {
            if (result.isPremium) {
                chrome.runtime.sendMessage({action: 'updateCustomBlockedSites', sites: sites});
            } else {
                chrome.storage.sync.set({blockedSites: sites});
            }
        });
    }

    function saveSettings() {
        const settings = {
            defaultFocusDuration: defaultFocusDurationInput.value,
            showQuotes: showQuotesCheckbox.checked
        };
        chrome.storage.sync.set(settings, function() {
            saveBlockedSites();
            alert('Settings saved successfully!');
        });
    }

    // Load custom blocked sites for premium users
    chrome.storage.sync.get(['isPremium', 'customBlockedSites'], function(result) {
        if (result.isPremium && result.customBlockedSites) {
            result.customBlockedSites.forEach(site => addBlockedSite(site));
        }
    });
});
