export const STORAGE_KEYS = {
  SETTINGS: '16chitthi_settings',
  LEADERBOARD: '16chitthi_leaderboard',
  GAME_STATE: '16chitthi_game_state',
};

/**
 * @param {string} key
 * @param {unknown} fallback
 * @returns {unknown}
 */
export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota or private mode — fail silently for now
  }
}

export function getLeaderboard() {
  return getItem(STORAGE_KEYS.LEADERBOARD, []);
}

export function saveLeaderboard(winnerName, slackerName, slackerTime) {
  const leaderboard = getLeaderboard();

  const updateEntry = (name, winIncrement, penaltyIncrement, time) => {
    if (!name) return;
    const nameLower = name.trim().toLowerCase();
    const index = leaderboard.findIndex(
      (entry) => entry.name.trim().toLowerCase() === nameLower
    );

    if (index > -1) {
      leaderboard[index].wins = (leaderboard[index].wins || 0) + winIncrement;
      leaderboard[index].penalties = (leaderboard[index].penalties || 0) + penaltyIncrement;

      if (time && time > 0) {
        const currentFastest = leaderboard[index].fastestReaction;
        if (!currentFastest || time < currentFastest) {
          leaderboard[index].fastestReaction = time;
        }
      }
    } else {
      leaderboard.push({
        name: name.trim(),
        wins: winIncrement,
        penalties: penaltyIncrement,
        fastestReaction: (time && time > 0) ? time : null,
      });
    }
  };

  if (winnerName) {
    updateEntry(winnerName, 1, 0, null);
  }
  if (slackerName) {
    updateEntry(slackerName, 0, 1, slackerTime);
  }

  // Sort by wins descending
  leaderboard.sort((a, b) => (b.wins || 0) - (a.wins || 0));

  setItem(STORAGE_KEYS.LEADERBOARD, leaderboard);
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function clearLeaderboard() {
  removeItem(STORAGE_KEYS.LEADERBOARD);
}
