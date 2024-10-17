function updateTimer() {
  const timeRemaining = getTimeRemaining();
  if (timeRemaining <= 0) {
    endFocusMode();
  }
  chrome.runtime.sendMessage({
    action: "updateTimer",
    timeRemaining: timeRemaining,
  });
}

function getTimeRemaining() {
  return isInFocusMode
    ? Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000))
    : 0;
}
