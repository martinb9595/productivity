let isInFocusMode = false;
let blockedSites = [];
let focusEndTime = 0;
let timerInterval;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['blockedSites', 'isInFocusMode'], function(result) {
        if (result.blockedSites) {
            blockedSites = result.blockedSites;
        }
        if (result.isInFocusMode) {
            isInFocusMode = result.isInFocusMode;
        }
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.blockedSites) {
            blockedSites = changes.blockedSites.newValue;
        }
        if (changes.isInFocusMode) {
            isInFocusMode = changes.isInFocusMode.newValue;
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startFocusMode') {
        isInFocusMode = true;
        focusEndTime = Date.now() + request.duration * 1000;
        chrome.alarms.create('focusModeEnd', { when: focusEndTime });
        startTimer(request.duration);
    } else if (request.action === 'endFocusMode') {
        isInFocusMode = false;
        chrome.alarms.clear('focusModeEnd');
        clearInterval(timerInterval);
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
        endFocusMode();
    }
});

function startTimer(duration) {
    let timeRemaining = duration;
    updateTimer(timeRemaining);
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimer(timeRemaining);
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function updateTimer(timeRemaining) {
    chrome.runtime.sendMessage({
        action: 'updateTimer',
        timeRemaining: timeRemaining
    });
}

function endFocusMode() {
    isInFocusMode = false;
    chrome.storage.sync.set({isInFocusMode: false});
    clearInterval(timerInterval);
    
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'default_icon.png',
        title: 'Focus Mode Ended',
        message: 'Great job! Your focus session has ended.'
    });
}
