// Background script for the Focus Mode extension

import { startFocusMode, endFocusMode } from "./background/focusMode.js";
import { updateTimer, getTimeRemaining } from "./background/timer.js";
import { updateStreak, getProductivityReport } from "./background/analytics.js";
import { validateCouponCode } from "./background/premium.js"; // Ensure this is imported if used

self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

let isInFocusMode = false;
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
  chrome.storage.sync.get(["blockedSites", "isInFocusMode"], function (result) {
    blockedSites = result.blockedSites || [];
    isInFocusMode = result.isInFocusMode || false;
  });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
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
    isInFocusMode = true;
    focusEndTime = Date.now() + request.duration * 1000;
    chrome.alarms.create("focusModeEnd", { when: focusEndTime });
    startTimer(request.duration);
    sendResponse({ success: true });
  } else if (request.action === "endFocusMode") {
    endFocusMode();
    sendResponse({ success: true });
  } else if (request.action === "validateCoupon") {
    validateCouponCode(request.code).then((isValid) => {
      sendResponse({ valid: isValid });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === "getTimerStatus") {
    const currentTime = Date.now();
    const timeRemaining = isInFocusMode
      ? Math.max(0, Math.floor((focusEndTime - currentTime) / 1000))
      : 0;
    sendResponse({ timeRemaining });
  } else if (request.action === "removePremium") {
    chrome.storage.sync.set({ isPremium: false }, () => {
      sendResponse({ success: true });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === "getProductivityAnalytics") {
    chrome.storage.sync.get(
      ["productivityAnalytics", "isPremium"],
      function (result) {
        const analytics = result.productivityAnalytics || {};
        const isPremium = result.isPremium || false;
        const timeframe = isPremium ? request.timeframe : "weekly";
        const report = getProductivityReport(timeframe);
        sendResponse({ analytics: report, isPremium });
      }
    );
    return true; // Indicates that the response is sent asynchronously
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusModeEnd") {
    endFocusMode();
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
  chrome.storage.sync.set({ productivityAnalytics });

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimer(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      endFocusMode();
    }
  }, 1000);
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (isInFocusMode && details.frameId === 0) {
    const url = new URL(details.url);
    chrome.storage.sync.get(
      ["isPremium", "customBlockedSites", "freeBlockedSites"],
      function (result) {
        const customBlockedSites = result.isPremium
          ? result.customBlockedSites || []
          : result.freeBlockedSites || [];
        if (customBlockedSites.some((site) => url.hostname.includes(site))) {
          chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL("blocked.html"),
          });
        }
      }
    );
  }
});
