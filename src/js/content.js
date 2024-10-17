import { updateTimerDisplay, startTimerUpdate } from './utils/timerUtils.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateTimer") {
    updateTimerDisplay(request.timeRemaining);
  }
});

function updateTimer(timeRemaining, timerElement) {
  updateTimerDisplay(timeRemaining, timerElement);
}

document.addEventListener("DOMContentLoaded", () => {
    const timerElement = document.getElementById('focus-timer');
    startTimerUpdate(1000, timerElement);
});

// Check if we're in focus mode when the content script loads
if (chrome.storage && chrome.storage.sync) {
  chrome.storage.sync.get(["isInFocusMode"], function (result) {
    if (result.isInFocusMode) {
      disableSocialMediaFeed();
    }
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.isInFocusMode) {
      if (changes.isInFocusMode.newValue) {
        disableSocialMediaFeed();
      } else {
        location.reload(); // Reload the page when focus mode ends
      }
    }
  });
}
