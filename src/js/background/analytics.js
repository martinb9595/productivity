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


function getProductivityReport(timeframe) {
  const today = new Date();
  let startDate;

  switch (timeframe) {
    case "daily":
      startDate = new Date(today.setDate(today.getDate() - 1));
      break;
    case "weekly":
      startDate = new Date(today.setDate(today.getDate() - 7));
      break;
    case "monthly":
      startDate = new Date(today.setMonth(today.getMonth() - 1));
      break;
    default:
      startDate = new Date(0); // All time
  }

  const report = {
    focusSessions: 0,
    totalFocusTime: 0,
    dailyFocusTime: {},
    websitesBlocked: {},
    streaks: productivityAnalytics.streaks,
  };

  for (let date in productivityAnalytics.dailyFocusTime) {
    if (new Date(date) >= startDate) {
      report.focusSessions++;
      report.totalFocusTime += productivityAnalytics.dailyFocusTime[date];
      report.dailyFocusTime[date] = productivityAnalytics.dailyFocusTime[date];
    }
  }

  for (let site in productivityAnalytics.websitesBlocked) {
    if (productivityAnalytics.websitesBlocked[site].lastBlocked >= startDate) {
      report.websitesBlocked[site] =
        productivityAnalytics.websitesBlocked[site].count;
    }
  }

  return report;
}
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

function getProductivityReport(timeframe) {
  const today = new Date();
  let startDate;

  switch (timeframe) {
    case "daily":
      startDate = new Date(today.setDate(today.getDate() - 1));
      break;
    case "weekly":
      startDate = new Date(today.setDate(today.getDate() - 7));
      break;
    case "monthly":
      startDate = new Date(today.setMonth(today.getMonth() - 1));
      break;
    default:
      startDate = new Date(0); // All time
  }

  const report = {
    focusSessions: 0,
    totalFocusTime: 0,
    dailyFocusTime: {},
    websitesBlocked: {},
    streaks: productivityAnalytics.streaks,
  };

  for (let date in productivityAnalytics.dailyFocusTime) {
    if (new Date(date) >= startDate) {
      report.focusSessions++;
      report.totalFocusTime += productivityAnalytics.dailyFocusTime[date];
      report.dailyFocusTime[date] = productivityAnalytics.dailyFocusTime[date];
    }
  }

  for (let site in productivityAnalytics.websitesBlocked) {
    if (productivityAnalytics.websitesBlocked[site].lastBlocked >= startDate) {
      report.websitesBlocked[site] =
        productivityAnalytics.websitesBlocked[site].count;
    }
  }

  return report;
}
