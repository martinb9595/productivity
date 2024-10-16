const ADMIN_PREMIUM_CODE = '0888215426';

function validateCouponCode(code) {
    return new Promise((resolve) => {
        if (code === ADMIN_PREMIUM_CODE) {
            chrome.storage.sync.set({ isPremium: true }, () => {
                resolve(true);
            });
        } else {
            resolve(false);
        }
    });
}

function updateCustomBlockedSites(sites) {
    chrome.storage.sync.set({ customBlockedSites: sites });
}
