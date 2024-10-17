function startFocusMode(duration) {
  // Implementation for starting focus mode
}

function endFocusMode() {
  chrome.storage.local.set({ isInFocusMode: false, focusEndTime: 0 }, () => {
    console.log("Focus mode ended and state cleared from storage.");
  });
}

module.exports = { startFocusMode, endFocusMode };
