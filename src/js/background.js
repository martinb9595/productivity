let timerId;
let focusEndTime;

const startFocusMode = (duration) => {
    const timeInMs = duration * 60 * 1000; // Convert minutes to milliseconds
    focusEndTime = Date.now() + timeInMs;
    timerId = setTimeout(() => {
        chrome.storage.local.set({ isInFocusMode: false });
    }, timeInMs);
    chrome.storage.local.set({ isInFocusMode: true, focusEndTime });
};

const endFocusMode = () => {
    clearTimeout(timerId);
    chrome.storage.local.set({ isInFocusMode: false });
};

const getTimerStatus = () => {
    const timeRemaining = focusEndTime ? Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000)) : 0;
    return { timeRemaining };
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "startFocusMode":
            startFocusMode(request.duration);
            sendResponse({ success: true });
            break;
        case "endFocusMode":
            endFocusMode();
            sendResponse({ success: true });
            break;
        case "getTimerStatus":
            sendResponse(getTimerStatus());
            break;
        default:
            sendResponse({ success: false });
    }
    return true; // Keep the message channel open for asynchronous response
});
