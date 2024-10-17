const ADMIN_PREMIUM_CODE = "0888215426";


function updateStreak(today) {
  if (productivityAnalytics.streaks.lastFocusDate === today) {
    return;
  }

  const yesterday = new Date(
    new Date(today).setDate(new Date(today).getDate() - 1)
  )
    .toISOString()
    .split("T")[0];

  if (productivityAnalytics.streaks.lastFocusDate === yesterday) {
    productivityAnalytics.streaks.currentStreak++;
  } else {
    productivityAnalytics.streaks.currentStreak = 1;
  }

  if (
    productivityAnalytics.streaks.currentStreak >
    productivityAnalytics.streaks.longestStreak
  ) {
    productivityAnalytics.streaks.longestStreak =
      productivityAnalytics.streaks.currentStreak;
  }

  productivityAnalytics.streaks.lastFocusDate = today;
}
const ADMIN_PREMIUM_CODE = "0888215426";

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
