// This script will be injected into web pages
// It can be used to modify page content, such as replacing social media feeds

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'replaceFeed') {
        // Example: Replace the main content of the page with a motivational message
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h1>Stay Focused!</h1>
                <p>Your productivity is important. Get back to work!</p>
                <p>Time remaining in focus mode: ${request.timeRemaining}</p>
            </div>
        `;
    }
});
