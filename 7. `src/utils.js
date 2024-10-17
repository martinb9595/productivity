export const formatTimeRemaining = (timeRemaining) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const startTimerUpdate = (interval, setTimeRemaining) => {
  const update = () => {
    chrome.runtime.sendMessage({ action: "getTimerStatus" }, (response) => {
      if (response && response.timeRemaining !== undefined) {
        setTimeRemaining(response.timeRemaining);
      }
    });
  };
  update();
  return setInterval(update, interval);
};
