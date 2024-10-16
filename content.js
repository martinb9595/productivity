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
        const timerElement = document.getElementById('focus-timer');
        if (timerElement) {
            const minutes = Math.floor(request.timeRemaining / 60);
            const seconds = request.timeRemaining % 60;
            timerElement.textContent = `Time remaining in focus mode: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
});

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
