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

    // Load custom blocked sites for premium users
    chrome.storage.sync.get(['isPremium', 'customBlockedSites'], function(result) {
        if (result.isPremium) {
            if (result.customBlockedSites) {
                result.customBlockedSites.forEach(site => addBlockedSite(site));
            }
            newSiteInput.disabled = false;
            addSiteButton.disabled = false;
        } else {
            newSiteInput.disabled = true;
            addSiteButton.disabled = true;
            blockedSitesList.innerHTML = '<li>facebook.com</li><li>reddit.com</li><li>twitter.com</li>';
            const premiumMessage = document.createElement('p');
            premiumMessage.textContent = 'Upgrade to Premium to customize blocked sites.';
            premiumMessage.style.color = 'red';
            blockedSitesList.parentNode.insertBefore(premiumMessage, blockedSitesList);
        }
    });
});
