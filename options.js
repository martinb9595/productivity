// Add Chart.js to the page
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(script);

script.onload = function() {
    document.addEventListener('DOMContentLoaded', function() {
    const blockedSitesList = document.getElementById('blockedSites');
    const newSiteInput = document.getElementById('newSite');
    const addSiteButton = document.getElementById('addSite');
    const defaultFocusDurationInput = document.getElementById('defaultFocusDuration');
    const showQuotesCheckbox = document.getElementById('showQuotes');
    const saveSettingsButton = document.getElementById('saveSettings');

    // Load saved settings
    chrome.storage.sync.get(['blockedSites', 'defaultFocusDuration', 'showQuotes'], function(result) {
        if (result.blockedSites) {
            result.blockedSites.forEach(site => addBlockedSite(site));
        }
        if (result.defaultFocusDuration) {
            defaultFocusDurationInput.value = result.defaultFocusDuration;
        }
        if (result.showQuotes !== undefined) {
            showQuotesCheckbox.checked = result.showQuotes;
        }
    });

    addSiteButton.addEventListener('click', function() {
        const newSite = newSiteInput.value.trim();
        if (newSite) {
            addBlockedSite(newSite);
            newSiteInput.value = '';
            saveBlockedSites();
        }
    });

    saveSettingsButton.addEventListener('click', function() {
        saveSettings();
    });

    const upgradeToPremiumButton = document.getElementById('upgradeToPremium');
    const couponCodeInput = document.getElementById('couponCode');
    const applyCouponButton = document.getElementById('applyCoupon');
    const couponMessage = document.getElementById('couponMessage');
    const removePremiumButton = document.getElementById('removePremium');

    upgradeToPremiumButton.addEventListener('click', function() {
        // Implement your payment logic here
        alert('Redirecting to payment page...');
        // You would typically redirect to a payment processor or your own payment page
    });

    applyCouponButton.addEventListener('click', function() {
        const code = couponCodeInput.value.trim();
        if (code) {
            chrome.runtime.sendMessage({action: 'validateCoupon', code: code}, function(response) {
                if (response.valid) {
                    couponMessage.textContent = 'Coupon applied successfully! You now have premium access.';
                    couponMessage.style.color = 'green';
                    removePremiumButton.style.display = 'block';
                    // Refresh the page to update UI for premium features
                    location.reload();
                } else {
                    couponMessage.textContent = 'Invalid coupon code. Please try again.';
                    couponMessage.style.color = 'red';
                }
            });
        } else {
            couponMessage.textContent = 'Please enter a coupon code.';
            couponMessage.style.color = 'red';
        }
    });

    removePremiumButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({action: 'removePremium'}, function(response) {
            if (response.success) {
                couponMessage.textContent = 'Premium subscription removed successfully.';
                couponMessage.style.color = 'green';
                removePremiumButton.style.display = 'none';
                // Refresh the page to update UI for non-premium features
                location.reload();
            } else {
                couponMessage.textContent = 'Failed to remove premium subscription. Please try again.';
                couponMessage.style.color = 'red';
            }
        });
    });

    // Check premium status on page load
    chrome.storage.sync.get(['isPremium'], function(result) {
        if (result.isPremium) {
            removePremiumButton.style.display = 'block';
            document.getElementById('productivityAnalytics').style.display = 'block';
            loadProductivityAnalytics();
        }
    });

    function loadProductivityAnalytics() {
        const timeframeSelect = document.getElementById('timeframeSelect');
        const timeframe = timeframeSelect.value;

        chrome.runtime.sendMessage({action: 'getProductivityAnalytics', timeframe: timeframe}, function(response) {
            if (response.analytics) {
                document.getElementById('focusSessionsCount').textContent = response.analytics.focusSessions;
                document.getElementById('totalFocusTime').textContent = Math.round(response.analytics.totalFocusTime);
                document.getElementById('websitesBlockedCount').textContent = Object.keys(response.analytics.websitesBlocked).length;
                document.getElementById('currentStreak').textContent = response.analytics.streaks.currentStreak;
                document.getElementById('longestStreak').textContent = response.analytics.streaks.longestStreak;
            }

            if (!response.isPremium) {
                timeframeSelect.value = 'weekly';
                timeframeSelect.disabled = true;
            } else {
                timeframeSelect.disabled = false;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        // ... (existing code)

        const timeframeSelect = document.getElementById('timeframeSelect');
        timeframeSelect.addEventListener('change', loadProductivityAnalytics);

        // ... (existing code)
    });

    const donateButton = document.getElementById('donateButton');
    donateButton.addEventListener('click', function() {
        // Implement your donation logic here
        alert('Redirecting to donation page...');
        // You would typically redirect to a donation service or your own donation page
    });

    function addBlockedSite(site) {
        const li = document.createElement('li');
        li.textContent = site;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
            li.remove();
            saveBlockedSites();
        });
        li.appendChild(removeButton);
        blockedSitesList.appendChild(li);
    }

    function saveBlockedSites() {
        const sites = Array.from(blockedSitesList.children).map(li => li.textContent.replace('Remove', '').trim());
        chrome.storage.sync.get(['isPremium'], function(result) {
            if (result.isPremium) {
                chrome.storage.sync.set({customBlockedSites: sites}, function() {
                    chrome.runtime.sendMessage({action: 'updateCustomBlockedSites', sites: sites});
                });
            } else {
                chrome.storage.sync.set({freeBlockedSites: sites.slice(0, 3)}, function() {
                    chrome.runtime.sendMessage({action: 'updateFreeBlockedSites', sites: sites.slice(0, 3)});
                });
            }
        });
    }

    function saveSettings() {
        const settings = {
            defaultFocusDuration: defaultFocusDurationInput.value,
            showQuotes: showQuotesCheckbox.checked
        };
        chrome.storage.sync.set(settings, function() {
            saveBlockedSites();
            alert('Settings saved successfully!');
        });
    }

    // Load blocked sites for both free and premium users
    chrome.storage.sync.get(['isPremium', 'customBlockedSites', 'freeBlockedSites'], function(result) {
        if (result.isPremium) {
            if (result.customBlockedSites) {
                result.customBlockedSites.forEach(site => addBlockedSite(site));
            }
            document.getElementById('blockedSitesLimit').style.display = 'none';
        } else {
            if (result.freeBlockedSites) {
                result.freeBlockedSites.forEach(site => addBlockedSite(site));
            }
            document.getElementById('blockedSitesLimit').style.display = 'block';
        }
        newSiteInput.disabled = false;
        addSiteButton.disabled = false;
    });

    addSiteButton.addEventListener('click', function() {
        const newSite = newSiteInput.value.trim();
        if (newSite) {
            chrome.storage.sync.get(['isPremium', 'freeBlockedSites'], function(result) {
                if (!result.isPremium && (!result.freeBlockedSites || result.freeBlockedSites.length >= 3)) {
                    alert('You have reached the maximum number of blocked sites for free users. Upgrade to Premium for unlimited blocking!');
                } else {
                    addBlockedSite(newSite);
                    newSiteInput.value = '';
                    saveBlockedSites();
                }
            });
        }
    });
});
