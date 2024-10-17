// Content script for the Focus Mode extension

function disableSocialMediaFeed() {
    const socialMediaSites = ['facebook.com', 'twitter.com', 'instagram.com'];
    const currentSite = window.location.hostname;

    if (socialMediaSites.some(site => currentSite.includes(site))) {
        const feedElements = {
            'facebook.com': '#stream_pagelet',
            'twitter.com': '[data-testid="primaryColumn"]',
            'instagram.com': 'main[role="main"]'
        };

        const feedSelector = feedElements[currentSite] || 'body';
        const feedElement = document.querySelector(feedSelector);

        if (feedElement) {
            feedElement.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                    <h1>Stay Focused!</h1>
                    <p>Your productivity is important. Get back to work!</p>
                    <p id="focus-timer">Time remaining in focus mode: calculating...</p>
                </div>
            `;
        }
    }
}

chrome.storage.sync.get(['isInFocusMode'], function(result) {
    if (result.isInFocusMode) {
        disableSocialMediaFeed();
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateTimer') {
        updateTimerDisplay(request.timeRemaining);
    }
});

function updateTimerDisplay(timeRemaining) {
    const timerElement = document.getElementById('focus-timer');
    if (timerElement) {
        timerElement.textContent = `Time remaining in focus mode: ${timeRemaining} seconds`;
    }
}
// Content script for the Focus Mode extension

function disableSocialMediaFeed() {
    const socialMediaSites = ['facebook.com', 'twitter.com', 'instagram.com'];
    const currentSite = window.location.hostname;

    if (socialMediaSites.some(site => currentSite.includes(site))) {
        const feedElements = {
            'facebook.com': '#stream_pagelet',
            'twitter.com': '[data-testid="primaryColumn"]',
            'instagram.com': 'main[role="main"]'
        };

        const feedSelector = feedElements[currentSite] || 'body';
        const feedElement = document.querySelector(feedSelector);

        if (feedElement) {
            feedElement.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                    <h1>Stay Focused!</h1>
                    <p>Your productivity is important. Get back to work!</p>
                    <p id="focus-timer">Time remaining in focus mode: calculating...</p>
                </div>
            `;
        }
    }
}

chrome.storage.sync.get(['isInFocusMode'], function(result) {
    if (result.isInFocusMode) {
        disableSocialMediaFeed();
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateTimer') {
        updateTimerDisplay(request.timeRemaining);
    }
});

function updateTimerDisplay(timeRemaining) {
    const timerElement = document.getElementById('focus-timer');
    updateTimerDisplay(timeRemaining, timerElement);
}
// This script will be injected into web pages
// It can be used to modify page content, such as replacing social media feeds

function disableSocialMediaFeed() {
    const socialMediaSites = ['facebook.com', 'twitter.com', 'instagram.com'];
    const currentSite = window.location.hostname;

    if (socialMediaSites.some(site => currentSite.includes(site))) {
        const feedElements = {
            'facebook.com': '#stream_pagelet',
            'twitter.com': '[data-testid="primaryColumn"]',
            'instagram.com': 'main[role="main"]'
        };

        const feedSelector = feedElements[currentSite] || 'body';
        const feedElement = document.querySelector(feedSelector);

        if (feedElement) {
            feedElement.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                    <h1>Stay Focused!</h1>
                    <p>Your productivity is important. Get back to work!</p>
                    <p id="focus-timer">Time remaining in focus mode: calculating...</p>
                </div>
            `;
        }
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateTimer') {
        updateTimerDisplay(request.timeRemaining);
    }
});

function updateTimerDisplay(timeRemaining) {
    const timerElement = document.getElementById('focus-timer');
    updateTimerDisplay(timeRemaining, timerElement);
}

// Initial timer update when the content script loads
function updateTimer() {
    chrome.runtime.sendMessage({action: 'getTimerStatus'}, (response) => {
        if (response && response.timeRemaining !== undefined) {
            updateTimerDisplay(response.timeRemaining);
        }
        // Schedule the next update
        setTimeout(updateTimer, 1000);
    });
}

// Start updating the timer
updateTimer();

// Check if we're in focus mode when the content script loads
chrome.storage.sync.get(['isInFocusMode'], function(result) {
    if (result.isInFocusMode) {
        disableSocialMediaFeed();
    }
});

// Listen for changes in focus mode status
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.isInFocusMode) {
        if (changes.isInFocusMode.newValue) {
            disableSocialMediaFeed();
        } else {
            location.reload(); // Reload the page when focus mode ends
        }
    }
});
