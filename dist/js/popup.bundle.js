(()=>{"use strict";document.addEventListener("DOMContentLoaded",(function(){var t=document.getElementById("focusStatus"),e=document.getElementById("openSettings");function n(){chrome.runtime.sendMessage({action:"getTimerStatus"},(function(e){if(e&&void 0!==e.timeRemaining){var n=e.timeRemaining;n>0?(t.textContent="Focus mode is running... Time left: ".concat((o=n,s=Math.floor(o/60),i=o%60,"".concat(s,":").concat(i.toString().padStart(2,"0")))),t.classList.remove("text-red-500"),t.classList.add("text-green-500")):(t.textContent="Focus mode ended.",t.classList.remove("text-green-500"),t.classList.add("text-red-500"))}else t.textContent="Focus mode is not running.",t.classList.remove("text-green-500"),t.classList.add("text-red-500");var o,s,i}))}var o=document.getElementById("focusStatus");function s(){chrome.runtime.sendMessage({action:"getTimerStatus"},(function(t){if(t&&void 0!==t.timeRemaining){var e=Math.floor(t.timeRemaining/60),n=t.timeRemaining%60;o.textContent="Focus mode is running... Time left: ".concat(e,":").concat(n.toString().padStart(2,"0")),o.classList.remove("text-red-500"),o.classList.add("text-green-500")}else o.textContent="Focus mode is not running.",o.classList.remove("text-green-500"),o.classList.add("text-red-500")}))}chrome.runtime.onMessage.addListener((function(t,e,n){if("updateTimer"===t.action){var s=Math.floor(t.timeRemaining/60),i=t.timeRemaining%60;o.textContent="Focus mode is running... Time left: ".concat(s,":").concat(i.toString().padStart(2,"0")),o.classList.remove("text-red-500"),o.classList.add("text-green-500")}})),setInterval(s,1e3),s(),e&&e.addEventListener("click",(function(){chrome.tabs.create({url:chrome.runtime.getURL("src/html/settings.html")})}));var i=document.getElementById("toggleFocus");i&&i.addEventListener("click",(function(){var t=document.getElementById("focusDuration"),e=document.getElementById("focusStatus"),o=parseInt(t.value,10);isNaN(o)||o<=0?e.textContent="Please enter a valid focus duration.":chrome.runtime.sendMessage({action:"startFocusMode",duration:o},(function(t){t&&t.success?(console.log("Focus mode started"),chrome.storage.local.set({isInFocusMode:!0,focusEndTime:Date.now()+60*o*1e3},(function(){n()}))):(console.error("Failed to start focus mode"),e.textContent="Failed to start focus mode.")}))}))}))})();