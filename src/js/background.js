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
