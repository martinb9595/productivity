document.addEventListener('DOMContentLoaded', function() {
    const focusStatus = document.getElementById('focusStatus');
    chrome.storage.local.get(["isInFocusMode", "focusEndTime"], (result) => {
        if (result.isInFocusMode && result.focusEndTime) {
            const timeLeft = Math.max(0, Math.floor((result.focusEndTime - Date.now()) / 1000));
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            focusStatus.textContent = `Focus mode is running... Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            focusStatus.classList.remove("text-red-500");
            focusStatus.classList.add("text-green-500");
        } else {
            focusStatus.textContent = "Focus mode is not running.";
        }
    });

    // Sync settings
    const defaultFocusDurationInput = document.getElementById('defaultFocusDuration');
    chrome.storage.sync.get(['defaultFocusDuration'], function(result) {
        if (result.defaultFocusDuration) {
            defaultFocusDurationInput.value = result.defaultFocusDuration;
        }
    });

    defaultFocusDurationInput.addEventListener('change', function() {
        chrome.storage.sync.set({ defaultFocusDuration: defaultFocusDurationInput.value });
    });
});
