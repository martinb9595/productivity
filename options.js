document.addEventListener('DOMContentLoaded', function() {
    const blockedSitesList = document.getElementById('blockedSitesList');
    const newSiteInput = document.getElementById('newSite');
    const addSiteButton = document.getElementById('addSite');
    const defaultFocusDurationInput = document.getElementById('defaultFocusDuration');
    const showQuotesCheckbox = document.getElementById('showQuotes');
    const saveSettingsButton = document.getElementById('saveSettings');
    const upgradeToPremiumButton = document.getElementById('upgradeToPremium');
    const couponCodeInput = document.getElementById('couponCode');
    const applyCouponButton = document.getElementById('applyCoupon');
    const removePremiumButton = document.getElementById('removePremium');
    const donateButton = document.getElementById('donateButton');
    const timeframeSelect = document.getElementById('timeframeSelect');

    // Load saved settings
    chrome.storage.sync.get(['blockedSites', 'defaultFocusDuration', 'showQuotes', 'isPremium'], function(result) {
        if (result.blockedSites) {
            result.blockedSites.forEach(site => addBlockedSite(site));
        }
        if (result.defaultFocusDuration) {
            defaultFocusDurationInput.value = result.defaultFocusDuration;
        }
        if (result.showQuotes !== undefined) {
            showQuotesCheckbox.checked = result.showQuotes;
        }
        if (result.isPremium) {
            removePremiumButton.style.display = 'block';
            document.getElementById('productivityAnalytics').style.display = 'block';
            loadProductivityAnalytics();
        }
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

    saveSettingsButton.addEventListener('click', saveSettings);

    upgradeToPremiumButton.addEventListener('click', function() {
        document.getElementById('couponCodeSection').style.display = 'block';
    });

    applyCouponButton.addEventListener('click', function() {
        const code = couponCodeInput.value.trim();
        if (code) {
            chrome.runtime.sendMessage({action: 'validateCoupon', code: code}, function(response) {
                const couponMessage = document.getElementById('couponMessage');
                if (response && response.valid) {
                    couponMessage.textContent = 'Coupon applied successfully! You now have premium access.';
                    couponMessage.style.color = 'green';
                    removePremiumButton.style.display = 'block';
                    upgradeToPremiumButton.style.display = 'none';
                    document.getElementById('couponCodeSection').style.display = 'none';
                    chrome.storage.sync.set({isPremium: true}, function() {
                        setTimeout(() => location.reload(), 2000);
                    });
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
            const couponMessage = document.getElementById('couponMessage');
            if (response.success) {
                couponMessage.textContent = 'Premium subscription removed successfully.';
                couponMessage.style.color = 'green';
                removePremiumButton.style.display = 'none';
                upgradeToPremiumButton.style.display = 'block';
                document.getElementById('productivityAnalytics').style.display = 'none';
                chrome.storage.sync.set({isPremium: false}, function() {
                    setTimeout(() => location.reload(), 2000);
                });
            } else {
                couponMessage.textContent = 'Failed to remove premium subscription. Please try again.';
                couponMessage.style.color = 'red';
            }
        });
    });

    const donateButton = document.getElementById('donateButton');
    if (donateButton) {
        donateButton.addEventListener('click', function() {
            alert('Thank you for your interest in donating! This feature is not yet implemented.');
        });
    }

    const timeframeSelect = document.getElementById('timeframeSelect');
    if (timeframeSelect) {
        timeframeSelect.addEventListener('change', loadProductivityAnalytics);
    }

    function loadProductivityAnalytics() {
        const timeframe = timeframeSelect ? timeframeSelect.value : 'weekly';
        chrome.runtime.sendMessage({action: 'getProductivityAnalytics', timeframe: timeframe}, function(response) {
            if (response.analytics) {
                document.getElementById('focusSessionsCount').textContent = response.analytics.focusSessions;
                document.getElementById('totalFocusTime').textContent = Math.round(response.analytics.totalFocusTime);
                document.getElementById('websitesBlockedCount').textContent = Object.keys(response.analytics.websitesBlocked).length;
                document.getElementById('currentStreak').textContent = response.analytics.streaks.currentStreak;
                document.getElementById('longestStreak').textContent = response.analytics.streaks.longestStreak;

                displayFocusTimeData(response.analytics.dailyFocusTime);
                displayWebsitesBlockedData(response.analytics.websitesBlocked);
            }

            if (!response.isPremium) {
                timeframeSelect.value = 'weekly';
                timeframeSelect.disabled = true;
            } else {
                timeframeSelect.disabled = false;
            }
        });
    }

    function displayFocusTimeData(dailyFocusTime) {
        const container = document.getElementById('focusTimeData');
        container.innerHTML = '<h3 class="text-lg font-semibold mb-2">Daily Focus Time</h3>';
        const ul = document.createElement('ul');
        ul.className = 'list-disc list-inside';
        for (const [date, time] of Object.entries(dailyFocusTime)) {
            const li = document.createElement('li');
            li.textContent = `${date}: ${time} minutes`;
            ul.appendChild(li);
        }
        container.appendChild(ul);
    }

    function displayWebsitesBlockedData(websitesBlocked) {
        const container = document.getElementById('websitesBlockedData');
        container.innerHTML = '<h3 class="text-lg font-semibold mb-2">Websites Blocked</h3>';
        const ul = document.createElement('ul');
        ul.className = 'list-disc list-inside';
        for (const [site, count] of Object.entries(websitesBlocked)) {
            const li = document.createElement('li');
            li.textContent = `${site}: ${count} times`;
            ul.appendChild(li);
        }
        container.appendChild(ul);
    }

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
});
