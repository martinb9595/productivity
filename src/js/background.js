let timerId;
let focusEndTime;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startFocusMode") {
        const duration = request.duration * 60 * 1000; // Convert minutes to milliseconds
        focusEndTime = Date.now() + duration;
        timerId = setTimeout(() => {
            chrome.storage.local.set({ isInFocusMode: false });
            sendResponse({ success: true });
        }, duration);
        chrome.storage.local.set({ isInFocusMode: true, focusEndTime });
        sendResponse({ success: true });
    } else if (request.action === "endFocusMode") {
        clearTimeout(timerId);
        chrome.storage.local.set({ isInFocusMode: false });
        sendResponse({ success: true });
    } else if (request.action === "getTimerStatus") {
        const timeRemaining = focusEndTime ? Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000)) : 0;
        sendResponse({ timeRemaining });
    }
    return true; // Keep the message channel open for asynchronous response
});
