document.addEventListener('DOMContentLoaded', function() {
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Believe you can and you're halfway there. - Theodore Roosevelt",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "Strive not to be a success, but rather to be of value. - Albert Einstein",
        "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
        "Do what you can, with what you have, where you are. - Theodore Roosevelt",
        "Everything you've ever wanted is on the other side of fear. - George Addair",
        "The way to get started is to quit talking and begin doing. - Walt Disney",
        "Don't watch the clock; do what it does. Keep going. - Sam Levenson"
    ];

    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
        // Update the timer every second
        setInterval(updateTimeRemaining, 1000);
    }

    function updateTimeRemaining() {
        chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
            if (response && response.timeRemaining !== undefined) {
                const minutes = Math.floor(response.timeRemaining / 60);
                const seconds = response.timeRemaining % 60;
                const timerElement = document.getElementById('focus-timer');
                if (timerElement) {
                    timerElement.textContent = `Time remaining in focus mode: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }
        });
    }

    // Initial call to set the timer immediately
    updateTimeRemaining();

    const quoteElement = document.getElementById('inspirational-quote');
    if (quoteElement) {
        quoteElement.textContent = getRandomQuote();
    } else {
        console.error('Element with id "inspirational-quote" not found');
    }
});
