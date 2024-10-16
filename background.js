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
        chrome.storage.sync.get(['isPremium', 'customBlockedSites'], function(result) {
            if (result.isPremium) {
                // Premium users get custom blocked website lists
                const customBlockedSites = result.customBlockedSites || [];
                if (customBlockedSites.some(site => url.hostname.includes(site))) {
                    chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('blocked.html') });
                }
            } else {
                // Free users get a predefined list of blocked sites
                const defaultBlockedSites = ['facebook.com', 'reddit.com', 'twitter.com'];
                if (defaultBlockedSites.some(site => url.hostname.includes(site))) {
                    chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('blocked.html') });
                }
            }
        });
    }
});

// Function to update custom blocked sites list
function updateCustomBlockedSites(sites) {
    chrome.storage.sync.set({ customBlockedSites: sites });
}

// Admin premium code
const ADMIN_PREMIUM_CODE = '0888215426';

// Function to validate coupon code
function validateCouponCode(code) {
    return new Promise((resolve) => {
        if (code === ADMIN_PREMIUM_CODE) {
            chrome.storage.sync.set({ isPremium: true }, () => {
                resolve(true);
            });
        } else {
            // Here you would typically check the code against a database or API
            // For now, we'll just reject any code that's not the admin code
            resolve(false);
        }
    });
}

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
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'updateTimer',
                timeRemaining: timeRemaining
            });
        }
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTimerStatus') {
        const currentTime = Date.now();
        const timeRemaining = isInFocusMode ? Math.max(0, Math.floor((focusEndTime - currentTime) / 1000)) : 0;
        sendResponse({timeRemaining: timeRemaining});
        return true; // Indicates that the response is sent asynchronously
    } else if (request.action === 'validateCoupon') {
        validateCouponCode(request.code).then(isValid => {
            sendResponse({valid: isValid});
        });
        return true; // Indicates that the response is sent asynchronously
    }
});

function endFocusMode() {
    isInFocusMode = false;
    chrome.storage.sync.set({isInFocusMode: false});
    clearInterval(timerInterval);
    
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon128.png',
        title: 'Focus Mode Ended',
        message: 'Great job! Your focus session has ended.'
    });
}
