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

export { disableSocialMediaFeed };
