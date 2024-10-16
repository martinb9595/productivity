let isInFocusMode = false;
let blockedSites = [];
let focusEndTime = 0;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['blockedSites'], function(result) {
        if (result.blockedSites) {
            blockedSites = result.blockedSites;
        }
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.blockedSites) {
        blockedSites = changes.blockedSites.newValue;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startFocusMode') {
        isInFocusMode = true;
        focusEndTime = Date.now() + request.duration * 1000;
        chrome.alarms.create('focusModeEnd', { when: focusEndTime });
    } else if (request.action === 'endFocusMode') {
        isInFocusMode = false;
        chrome.alarms.clear('focusModeEnd');
    }
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (isInFocusMode && details.frameId === 0) {
        const url = new URL(details.url);
        if (blockedSites.some(site => url.hostname.includes(site))) {
            chrome.tabs.update(details.tabId, { url: 'blocked.html' });
        }
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'focusModeEnd') {
        isInFocusMode = false;
        // Notify user that focus mode has ended
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon128.png',
            title: 'Focus Mode Ended',
            message: 'Great job! Your focus session has ended.'
        });
    }
});
