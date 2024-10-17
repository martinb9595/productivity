document.addEventListener('DOMContentLoaded', function() {
    const motivationDiv = document.getElementById('motivation');
    const motivationalQuote = document.getElementById('motivationalQuote');

    function updateMotivationalQuote() {
        // For now, we'll use a static quote. In the future, this could be fetched from an API or a list of quotes.
        motivationalQuote.textContent = "Stay focused and keep pushing forward!";
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateTimer') {
            updateTimer(request.timeRemaining);
        }
    });

    function updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeLeft.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
});
