let isInFocusMode = false;
let focusEndTime = 0;
let timerInterval;

function startFocusMode(duration) {
  isInFocusMode = true;
  focusEndTime = Date.now() + duration * 1000;
  chrome.storage.sync.set({ isInFocusMode: true });

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function endFocusMode() {
  isInFocusMode = false;
  chrome.storage.sync.set({ isInFocusMode: false });
  clearInterval(timerInterval);

  chrome.notifications.create({
    type: "basic",
    iconUrl: "images/icon128.png",
    title: "Focus Mode Ended",
    message: "Great job! Your focus session has ended.",
  });
}
function startFocusMode(duration) {
  isInFocusMode = true;
  focusEndTime = Date.now() + duration * 1000;
  chrome.storage.sync.set({ isInFocusMode: true });

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function endFocusMode() {
  isInFocusMode = false;
  chrome.storage.sync.set({ isInFocusMode: false });
  clearInterval(timerInterval);

  chrome.notifications.create({
    type: "basic",
    iconUrl: "images/icon128.png",
    title: "Focus Mode Ended",
    message: "Great job! Your focus session has ended.",
  });
}

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
