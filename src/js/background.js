// Background script for the Focus Mode extension

import { startFocusMode, endFocusMode } from "./background/focusMode.js";
import { getTimeRemaining } from "./background/timer.js";
import { updateTimerDisplay as updateTimer } from "./utils/timerUtils.js";
import { updateStreak, getProductivityReport } from "./background/analytics.js";
import { updateCustomBlockedSites } from "./background/premium.js";

self.addEventListener("install", (event) => {
  console.log("Service worker installed");
  });

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

let blockedSites = [];
let focusEndTime = 0;
let timerInterval;
let productivityAnalytics = {
  focusSessions: 0,
  totalFocusTime: 0,
  dailyFocusTime: {},
  websitesBlocked: {},
  streaks: {
    currentStreak: 0,
    longestStreak: 0,
    lastFocusDate: null,
  },
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(
    ["blockedSites", "isInFocusMode"],
    function (result) {
      if (result.blockedSites) {
        blockedSites = result.blockedSites;
      }
      if (result.isInFocusMode) {
        isInFocusMode = result.isInFocusMode;
      }
    }
  );
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    if (changes.blockedSites) {
      blockedSites = changes.blockedSites.newValue;
    }
    if (changes.isInFocusMode) {
      isInFocusMode = changes.isInFocusMode.newValue;
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startFocusMode") {
    chrome.storage.local.set({ isInFocusMode: true }, () => {
      focusEndTime = Date.now() + request.duration * 1000;
      chrome.alarms.create("focusModeEnd", { when: focusEndTime });
      startTimer(request.duration);
    });
  } else if (request.action === "endFocusMode") {
    chrome.storage.local.set({ isInFocusMode: false }, () => {
      chrome.alarms.clear("focusModeEnd");
      clearInterval(timerInterval);
    });
  }
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (isInFocusMode && details.frameId === 0) {
    const url = new URL(details.url);
    chrome.storage.local.get(
      ["isPremium", "customBlockedSites", "freeBlockedSites"],
      function (result) {
        if (result.isPremium) {
          const customBlockedSites = result.customBlockedSites || [];
          if (customBlockedSites.some((site) => url.hostname.includes(site))) {
            chrome.tabs.update(details.tabId, {
              url: chrome.runtime.getURL("blocked.html"),
            });
          }
        } else {
          const freeBlockedSites = result.freeBlockedSites || [];
          if (freeBlockedSites.some((site) => url.hostname.includes(site))) {
            chrome.tabs.update(details.tabId, {
              url: chrome.runtime.getURL("blocked.html"),
            });
          }
        }
      }
    );
  }
});

function startTimer(duration) {
  let timeRemaining = duration;
  updateTimer(timeRemaining);

  productivityAnalytics.focusSessions++;
  const today = new Date().toISOString().split("T")[0];
  productivityAnalytics.dailyFocusTime[today] =
    (productivityAnalytics.dailyFocusTime[today] || 0) + duration / 60;
  productivityAnalytics.totalFocusTime += duration / 60;

  updateStreak(today);

  chrome.storage.local.set({ productivityAnalytics: productivityAnalytics });

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimer(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      endFocusMode();
    }
  }, 1000);
}
