// Background script for the Focus Mode extension

let isInFocusMode = false;
let focusEndTime = 0;
let timerInterval;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['isInFocusMode'], function(result) {
        isInFocusMode = result.isInFocusMode || false;
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startFocusMode') {
        startFocusMode(request.duration);
    } else if (request.action === 'endFocusMode') {
        endFocusMode();
    } else if (request.action === 'getTimerStatus') {
        sendResponse({timeRemaining: getTimeRemaining()});
    }
});

function startFocusMode(duration) {
    isInFocusMode = true;
    focusEndTime = Date.now() + duration * 1000;
    chrome.storage.sync.set({isInFocusMode: true});
    
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function endFocusMode() {
    isInFocusMode = false;
    chrome.storage.sync.set({isInFocusMode: false});
    clearInterval(timerInterval);
}

function updateTimer() {
    const timeRemaining = getTimeRemaining();
    if (timeRemaining <= 0) {
        endFocusMode();
    }
    chrome.runtime.sendMessage({action: 'updateTimer', timeRemaining: timeRemaining});
}

function getTimeRemaining() {
    return isInFocusMode ? Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000)) : 0;
}
// Background script for the Focus Mode extension

let isInFocusMode = false;
let focusEndTime = 0;
let timerInterval;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['isInFocusMode'], function(result) {
        isInFocusMode = result.isInFocusMode || false;
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startFocusMode') {
        startFocusMode(request.duration);
    } else if (request.action === 'endFocusMode') {
        endFocusMode();
    } else if (request.action === 'getTimerStatus') {
        sendResponse({timeRemaining: getTimeRemaining()});
    }
});

function startFocusMode(duration) {
    isInFocusMode = true;
    focusEndTime = Date.now() + duration * 1000;
    chrome.storage.sync.set({isInFocusMode: true});
    
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function endFocusMode() {
    isInFocusMode = false;
    chrome.storage.sync.set({isInFocusMode: false});
    clearInterval(timerInterval);
}

function updateTimer() {
    const timeRemaining = getTimeRemaining();
    if (timeRemaining <= 0) {
        endFocusMode();
    }
    chrome.runtime.sendMessage({action: 'updateTimer', timeRemaining: timeRemaining});
}

function getTimeRemaining() {
    return isInFocusMode ? Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000)) : 0;
}
let blockedSites = [];
let focusEndTime = 0;
let timerInterval;
let productivityAnalytics = {
    focusSessions: 0,
    totalFocusTime: 0,
    dailyFocusTime: {},
    websitesBlocked: {},
    streaks: {
        currentStreak: 0,
        longestStreak: 0,
        lastFocusDate: null
    }
};

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
        chrome.storage.sync.get(['isPremium', 'customBlockedSites', 'freeBlockedSites'], function(result) {
            if (result.isPremium) {
                // Premium users get custom blocked website lists
                const customBlockedSites = result.customBlockedSites || [];
                if (customBlockedSites.some(site => url.hostname.includes(site))) {
                    chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('blocked.html') });
                }
            } else {
                // Free users get a limited custom list of blocked sites
                const freeBlockedSites = result.freeBlockedSites || [];
                if (freeBlockedSites.some(site => url.hostname.includes(site))) {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'validateCoupon') {
        validateCouponCode(request.code).then(isValid => {
            sendResponse({valid: isValid});
        });
        return true; // Indicates that the response is sent asynchronously
    } else if (request.action === 'getTimerStatus') {
        const currentTime = Date.now();
        const timeRemaining = isInFocusMode ? Math.max(0, Math.floor((focusEndTime - currentTime) / 1000)) : 0;
        sendResponse({timeRemaining: timeRemaining});
        return true;
    } else if (request.action === 'removePremium') {
        chrome.storage.sync.set({ isPremium: false }, () => {
            sendResponse({success: true});
        });
        return true;
    } else if (request.action === 'getProductivityAnalytics') {
        chrome.storage.sync.get(['productivityAnalytics', 'isPremium'], function(result) {
            const analytics = result.productivityAnalytics || {};
            const isPremium = result.isPremium || false;
            const timeframe = isPremium ? request.timeframe : 'weekly';
            const report = getProductivityReport(timeframe);
            sendResponse({analytics: report, isPremium: isPremium});
        });
        return true;
    }
    // ... other message handlers
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'focusModeEnd') {
        endFocusMode();
    }
});

function startTimer(duration) {
    let timeRemaining = duration;
    updateTimer(timeRemaining);
    
    productivityAnalytics.focusSessions++;
    const today = new Date().toISOString().split('T')[0];
    productivityAnalytics.dailyFocusTime[today] = (productivityAnalytics.dailyFocusTime[today] || 0) + duration / 60;
    productivityAnalytics.totalFocusTime += duration / 60;

    updateStreak(today);

    chrome.storage.sync.set({ productivityAnalytics: productivityAnalytics });
    
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
    } else if (request.action === 'removePremium') {
        chrome.storage.sync.set({ isPremium: false }, () => {
            sendResponse({success: true});
        });
        return true; // Indicates that the response is sent asynchronously
    } else if (request.action === 'getProductivityAnalytics') {
        chrome.storage.sync.get(['productivityAnalytics', 'isPremium'], function(result) {
            const analytics = result.productivityAnalytics || {};
            const isPremium = result.isPremium || false;
            const timeframe = isPremium ? request.timeframe : 'weekly';
            const report = getProductivityReport(timeframe);
            sendResponse({analytics: report, isPremium: isPremium});
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

function updateStreak(today) {
    if (productivityAnalytics.streaks.lastFocusDate === today) {
        return;
    }
    
    const yesterday = new Date(new Date(today).setDate(new Date(today).getDate() - 1)).toISOString().split('T')[0];
    
    if (productivityAnalytics.streaks.lastFocusDate === yesterday) {
        productivityAnalytics.streaks.currentStreak++;
    } else {
        productivityAnalytics.streaks.currentStreak = 1;
    }
    
    if (productivityAnalytics.streaks.currentStreak > productivityAnalytics.streaks.longestStreak) {
        productivityAnalytics.streaks.longestStreak = productivityAnalytics.streaks.currentStreak;
    }
    
    productivityAnalytics.streaks.lastFocusDate = today;
}

function getProductivityReport(timeframe) {
    const today = new Date();
    let startDate;
    
    switch(timeframe) {
        case 'daily':
            startDate = new Date(today.setDate(today.getDate() - 1));
            break;
        case 'weekly':
            startDate = new Date(today.setDate(today.getDate() - 7));
            break;
        case 'monthly':
            startDate = new Date(today.setMonth(today.getMonth() - 1));
            break;
        default:
            startDate = new Date(0); // All time
    }
    
    const report = {
        focusSessions: 0,
        totalFocusTime: 0,
        dailyFocusTime: {},
        websitesBlocked: {},
        streaks: productivityAnalytics.streaks
    };
    
    for (let date in productivityAnalytics.dailyFocusTime) {
        if (new Date(date) >= startDate) {
            report.focusSessions++;
            report.totalFocusTime += productivityAnalytics.dailyFocusTime[date];
            report.dailyFocusTime[date] = productivityAnalytics.dailyFocusTime[date];
        }
    }
    
    for (let site in productivityAnalytics.websitesBlocked) {
        if (productivityAnalytics.websitesBlocked[site].lastBlocked >= startDate) {
            report.websitesBlocked[site] = productivityAnalytics.websitesBlocked[site].count;
        }
    }
    
    return report;
}
