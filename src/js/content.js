const { updateTimerDisplay } = require('./utils/timerUtils.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateTimer") {
    updateTimerDisplay(request.timeRemaining);
  }
});

function updateTimer(timeRemaining, timerElement) {
  updateTimerDisplay(timeRemaining, timerElement);
}

// Ensure the document is fully loaded before starting the timer updates
document.addEventListener("DOMContentLoaded", () => {
  function updateTimer() {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      try {
        chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
          if (response && response.timeRemaining !== undefined) {
            updateTimerDisplay(response.timeRemaining);
          }
          // Schedule the next update
          setTimeout(updateTimer, 1000);
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  }

  // Start updating the timer
  updateTimer();
});

// Start updating the timer
updateTimer();

// Check if we're in focus mode when the content script loads
if (chrome.storage && chrome.storage.sync) {
  chrome.storage.sync.get(["isInFocusMode"], function (result) {
    if (result.isInFocusMode) {
      disableSocialMediaFeed();
    }
  });

  // Listen for changes in focus mode status
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
