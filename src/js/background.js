// Background script for the Focus Mode extension

import { startFocusMode, endFocusMode } from "./background/focusMode.js";
import { updateTimerDisplay as updateTimer } from "./utils/timerUtils.js";

self.addEventListener("install", () => console.log("Service worker installed"));
self.addEventListener("activate", () => console.log("Service worker activated"));

let blockedSites = [];
let isInFocusMode = false;
let focusEndTime = 0;
let timerInterval;
const productivityAnalytics = {
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
    chrome.storage.sync.get(["blockedSites"], (result) => {
        blockedSites = result.blockedSites || [];
    });
    chrome.storage.local.get(["isInFocusMode", "focusEndTime"], (result) => {
        isInFocusMode = result.isInFocusMode || false;
        focusEndTime = result.focusEndTime || 0;
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.blockedSites) {
        blockedSites = changes.blockedSites.newValue;
    }
    if (namespace === "local" && changes.isInFocusMode) {
        isInFocusMode = changes.isInFocusMode.newValue;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startFocusMode") {
        const durationInMilliseconds = request.duration * 60 * 1000;
        if (isNaN(durationInMilliseconds) || durationInMilliseconds <= 0) {
            sendResponse({ success: false, message: "Invalid focus duration" });
            return;
        }

        focusEndTime = Date.now() + durationInMilliseconds;
        chrome.storage.local.set({ isInFocusMode: true, focusEndTime }, () => {
            chrome.alarms.create("focusModeEnd", { when: focusEndTime });
            startTimer(request.duration * 60);
            sendResponse({ success: true });
        });
        return true;
    } else if (request.action === "endFocusMode") {
        chrome.storage.local.set({ isInFocusMode: false }, () => {
            chrome.alarms.clear("focusModeEnd");
            clearInterval(timerInterval);
            sendResponse({ success: true });
        });
        return true;
    } else if (request.action === "updatePopup") {
        chrome.storage.local.get(["isInFocusMode", "focusEndTime"], (result) => {
            if (result.isInFocusMode && result.focusEndTime) {
                const timeLeft = Math.max(0, Math.floor((result.focusEndTime - Date.now()) / 1000));
                chrome.runtime.sendMessage({ action: "updateTimer", timeRemaining: timeLeft });
            }
        });
        sendResponse({ success: true });
    } else if (request.action === "getTimerStatus") {
        const timeLeft = isInFocusMode ? Math.max(0, Math.floor((focusEndTime - Date.now()) / 1000)) : 0;
        sendResponse({ timeRemaining: timeLeft });
    } else {
        sendResponse({ success: false, message: "Unknown action" });
    }
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (isInFocusMode && Date.now() < focusEndTime && details.frameId === 0) {
        const url = new URL(details.url);
        if (blockedSites.some((site) => url.hostname.includes(site))) {
            chrome.tabs.update(details.tabId, {
                url: chrome.runtime.getURL("src/html/blocked.html"),
            });

            chrome.storage.local.get({ blockedPages: [] }, (result) => {
                const blockedPages = result.blockedPages;
                blockedPages.push(url.href);
                chrome.storage.local.set({ blockedPages });
            });
        }
    }
});

function startTimer(duration) {
    let timeRemaining = duration;
    updateTimer(timeRemaining);

    productivityAnalytics.focusSessions++;
    const today = new Date().toISOString().split("T")[0];
    productivityAnalytics.dailyFocusTime[today] = (productivityAnalytics.dailyFocusTime[today] || 0) + duration / 60;
    productivityAnalytics.totalFocusTime += duration / 60;

    updateStreak(today);
    chrome.storage.local.set({ productivityAnalytics });

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimer(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endFocusMode();
        }
    }, 1000);
}
