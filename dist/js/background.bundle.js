(()=>{var e={762:e=>{e.exports={startFocusMode:function(e){},endFocusMode:function(){chrome.storage.local.set({isInFocusMode:!1,focusEndTime:0},(function(){console.log("Focus mode ended and state cleared from storage.")}))}}}},o={};function t(s){var n=o[s];if(void 0!==n)return n.exports;var a=o[s]={exports:{}};return e[s](a,a.exports,t),a.exports}(()=>{"use strict";var e=t(762);function o(e,o){if(o)if(e>0){var t=Math.floor(e/60),s=e%60;o.textContent="Time remaining in focus mode: ".concat(t,":").concat(s.toString().padStart(2,"0"))}else o.textContent="Focus mode ended"}var s={focusSessions:0,totalFocusTime:0,dailyFocusTime:{},websitesBlocked:{},streaks:{currentStreak:0,longestStreak:0,lastFocusDate:null}};self.addEventListener("install",(function(e){console.log("Service worker installed")})),self.addEventListener("activate",(function(e){console.log("Service worker activated")}));var n,a=[],c=!1,r=0,i={focusSessions:0,totalFocusTime:0,dailyFocusTime:{},websitesBlocked:{},streaks:{currentStreak:0,longestStreak:0,lastFocusDate:null}};chrome.runtime.onInstalled.addListener((function(){chrome.storage.sync.get(["blockedSites"],(function(e){e.blockedSites&&(a=e.blockedSites)})),chrome.storage.local.get(["isInFocusMode","focusEndTime"],(function(e){e.isInFocusMode&&(c=e.isInFocusMode,r=e.focusEndTime||0)}))})),chrome.storage.onChanged.addListener((function(e,o){"sync"===o&&e.blockedSites&&(a=e.blockedSites.newValue),"local"===o&&e.isInFocusMode&&(c=e.isInFocusMode.newValue)})),chrome.runtime.onMessage.addListener((function(t,a,u){if("startFocusMode"===t.action){var l=60*t.duration*1e3;return isNaN(l)||l<=0?(console.error("Invalid focus duration"),void u({success:!1,message:"Invalid focus duration"})):(r=Date.now()+l,chrome.storage.local.set({isInFocusMode:!0,focusEndTime:r},(function(){chrome.alarms.create("focusModeEnd",{when:r}),function(t){var a=t;o(a),i.focusSessions++;var c=(new Date).toISOString().split("T")[0];i.dailyFocusTime[c]=(i.dailyFocusTime[c]||0)+t/60,i.totalFocusTime+=t/60,function(e){if(s.streaks.lastFocusDate!==e){var o=new Date(new Date(e).setDate(new Date(e).getDate()-1)).toISOString().split("T")[0];s.streaks.lastFocusDate===o?s.streaks.currentStreak++:s.streaks.currentStreak=1,s.streaks.currentStreak>s.streaks.longestStreak&&(s.streaks.longestStreak=s.streaks.currentStreak),s.streaks.lastFocusDate=e}}(c),chrome.storage.local.set({productivityAnalytics:i}),n=setInterval((function(){o(--a),a<=0&&(clearInterval(n),(0,e.endFocusMode)())}),1e3)}(60*t.duration),u({success:!0})})),!0)}if("endFocusMode"===t.action)return chrome.storage.local.set({isInFocusMode:!1},(function(){chrome.alarms.clear("focusModeEnd"),clearInterval(n),u({success:!0})})),!0;if("updatePopup"===t.action)chrome.storage.local.get(["isInFocusMode","focusEndTime"],(function(e){if(e.isInFocusMode&&e.focusEndTime){var o=Math.max(0,Math.floor((e.focusEndTime-Date.now())/1e3));chrome.runtime.sendMessage({action:"updateTimer",timeRemaining:o})}})),u({success:!0});else if("getTimerStatus"===t.action){var d=c?Math.max(0,Math.floor((r-Date.now())/1e3)):0;u({timeRemaining:d})}else u({success:!1,message:"Unknown action"})})),chrome.webNavigation.onBeforeNavigate.addListener((function(e){if(c&&Date.now()<r&&0===e.frameId){var o=new URL(e.url);a.some((function(e){return o.hostname.includes(e)}))&&(chrome.tabs.update(e.tabId,{url:chrome.runtime.getURL("src/html/blocked.html")}),chrome.storage.local.get({blockedPages:[]},(function(e){var t=e.blockedPages;t.push(o.href),chrome.storage.local.set({blockedPages:t})})))}}))})()})();