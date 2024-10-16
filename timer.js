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
