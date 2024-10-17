document.addEventListener('DOMContentLoaded', function() {
    const defaultFocusDurationInput = document.getElementById('defaultFocusDuration');
    const saveSettingsButton = document.getElementById('saveSettings');

    // Load saved settings
    chrome.storage.sync.get(['defaultFocusDuration'], function(result) {
        if (result.defaultFocusDuration) {
            defaultFocusDurationInput.value = result.defaultFocusDuration;
        }
    });

    saveSettingsButton.addEventListener('click', saveSettings);

    function saveSettings() {
        const settings = {
            defaultFocusDuration: defaultFocusDurationInput.value,
            blockedSites: Array.from(blockedSitesList.children).map(li => li.textContent.replace('Remove', '').trim())
        };
        chrome.storage.sync.set(settings, function() {
            alert('Settings saved successfully!');
        });
    }
});
