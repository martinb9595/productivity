document.addEventListener('DOMContentLoaded', function() {
    const blockedSitesList = document.getElementById('blockedSitesList');
    const newSiteInput = document.getElementById('newSite');
    const addSiteButton = document.getElementById('addSite');

    // Load saved settings
    chrome.storage.sync.get(['blockedSites'], function(result) {
        if (result.blockedSites) {
            result.blockedSites.forEach(site => addBlockedSite(site));
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
