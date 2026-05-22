/**
 * utils.js — Shared Utilities for StartHobby V1
 *
 * Provides localStorage helpers, coin logic, streak management,
 * toast notifications, achievement checking, active plan retrieval,
 * and saved hobby toggling.
 *
 * All functions are global (no ES modules) — loaded via <script> tag.
 */

// ─── localStorage Helpers ────────────────────────────────────────────────────

/**
 * Safely reads a value from localStorage with JSON parsing and error handling.
 * @param {string} key - The localStorage key to read.
 * @param {*} defaultValue - Value returned if key is missing or JSON is invalid.
 * @returns {*} Parsed value or defaultValue on failure.
 */
function getFromStorage(key, defaultValue) {
  try {
    var raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Writes a value to localStorage with JSON serialization.
 * Shows a warning toast if storage quota is exceeded.
 * @param {string} key - The localStorage key to write.
 * @param {*} value - The value to serialize and store.
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      showToast('Storage is full. Some data may not be saved.', 'warning');
    }
  }
}

// ─── Coin System ─────────────────────────────────────────────────────────────

/**
 * Adds coins to the current balance, persists, and returns the new total.
 * Handles NaN values by resetting to 0 before adding.
 * Clamps negative results to 0.
 * @param {number} amount - Number of coins to add.
 * @returns {number} The new coin total.
 */
function addCoins(amount) {
  var current = getFromStorage('coins', 0);
  if (typeof current !== 'number' || isNaN(current)) {
    current = 0;
  }
  var newTotal = current + amount;
  if (newTotal < 0) {
    newTotal = 0;
  }
  saveToStorage('coins', newTotal);
  return newTotal;
}

/**
 * Deducts coins if the balance is sufficient.
 * Handles NaN values by resetting to 0.
 * @param {number} amount - Number of coins to deduct.
 * @returns {boolean} True if deduction succeeded, false if insufficient balance.
 */
function deductCoins(amount) {
  var current = getFromStorage('coins', 0);
  if (typeof current !== 'number' || isNaN(current)) {
    current = 0;
  }
  if (current < amount) {
    return false;
  }
  var newTotal = current - amount;
  if (newTotal < 0) {
    newTotal = 0;
  }
  saveToStorage('coins', newTotal);
  return true;
}

// ─── Streak Logic ────────────────────────────────────────────────────────────

/**
 * Reads the current streak state from localStorage.
 * @returns {{ current: number, best: number, lastActiveDate: string|null }}
 */
function getStreak() {
  return getFromStorage('streak', { current: 0, best: 0, lastActiveDate: null });
}

/**
 * Updates the streak based on whether the user completed or skipped today's task.
 *
 * Skip logic:
 * - If completed is true, the streak increments and lastActiveDate updates to today.
 * - If completed is false (skip), check how many days were skipped this week:
 *   - If ≤1 skip this week, streak is preserved (no change to current).
 *   - If >1 skip this week, streak resets to 0.
 *
 * @param {boolean} completed - Whether the user completed today's task.
 * @returns {{ current: number, best: number, lastActiveDate: string }}
 */
function updateStreak(completed) {
  var streak = getStreak();
  var today = new Date().toISOString().split('T')[0];

  if (completed) {
    streak.current = streak.current + 1;
    streak.lastActiveDate = today;
    if (streak.current > streak.best) {
      streak.best = streak.current;
    }
  } else {
    // Skip logic: count skipped days this week from hobbyProgress
    var skipsThisWeek = getSkipsThisWeek();
    if (skipsThisWeek > 1) {
      // More than 1 skip already happened this week — reset streak
      streak.current = 0;
    }
    // If ≤1 skip this week, streak is preserved (no change)
    streak.lastActiveDate = today;
  }

  saveToStorage('streak', streak);
  return streak;
}

/**
 * Counts the number of skipped days in the current week from hobbyProgress.
 * Uses the skippedDays array from the active hobby's progress.
 * @returns {number} Number of skipped days this week.
 */
function getSkipsThisWeek() {
  var activeHobbyId = getFromStorage('activeHobby', null);
  if (!activeHobbyId) return 0;

  var progress = getFromStorage('hobbyProgress', {});
  var hobbyProgress = progress[activeHobbyId];
  if (!hobbyProgress || !hobbyProgress.skippedDays) return 0;

  return hobbyProgress.skippedDays.length;
}

// ─── Toast Notifications ─────────────────────────────────────────────────────

/**
 * Dispatches a 'show-toast' CustomEvent for the toast notification system.
 * @param {string} message - The message to display.
 * @param {string} type - Toast type: 'success', 'info', or 'warning'.
 */
function showToast(message, type) {
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: { message: message, type: type || 'info' }
  }));
}

// ─── Achievement Checking ────────────────────────────────────────────────────

/**
 * Evaluates all achievement thresholds against the current user state.
 * Unlocks any achievements whose conditions are met and not already unlocked.
 * @returns {string[]} Array of newly unlocked achievement IDs.
 */
function checkAchievements() {
  // ACHIEVEMENTS is defined in data.js (loaded before utils.js)
  if (typeof ACHIEVEMENTS === 'undefined') return [];

  var unlocked = getFromStorage('unlockedAchievements', []);
  var newlyUnlocked = [];

  // Gather current state
  var coins = getFromStorage('coins', 0);
  var streak = getStreak();
  var savedHobbies = getFromStorage('savedHobbies', []);
  var activeHobbyId = getFromStorage('activeHobby', null);
  var progress = getFromStorage('hobbyProgress', {});

  // Calculate total days completed across all hobbies
  var totalDays = 0;
  Object.keys(progress).forEach(function (hobbyId) {
    var hp = progress[hobbyId];
    if (hp && hp.completedDays) {
      totalDays += hp.completedDays.length;
    }
  });

  ACHIEVEMENTS.forEach(function (achievement) {
    // Skip already unlocked
    if (unlocked.indexOf(achievement.id) !== -1) return;

    var earned = false;

    if (achievement.daysThreshold != null && totalDays >= achievement.daysThreshold) {
      earned = true;
    }
    if (achievement.streakThreshold != null && streak.current >= achievement.streakThreshold) {
      earned = true;
    }
    if (achievement.coinThreshold != null && coins >= achievement.coinThreshold) {
      earned = true;
    }
    if (achievement.savedThreshold != null && savedHobbies.length >= achievement.savedThreshold) {
      earned = true;
    }
    if (achievement.milestoneId != null) {
      // Check if the milestone has been reached in any hobby progress
      Object.keys(progress).forEach(function (hobbyId) {
        var hp = progress[hobbyId];
        if (hp && hp.completedDays && hp.completedDays.length >= 7) {
          // Week 1 milestone reached
          if (achievement.milestoneId === 'week-1-complete') {
            earned = true;
          }
        }
      });
    }
    if (achievement.trigger != null) {
      // Trigger-based achievements (e.g., "plan-started")
      if (achievement.trigger === 'plan-started' && activeHobbyId) {
        earned = true;
      }
    }

    if (earned) {
      newlyUnlocked.push(achievement.id);
    }
  });

  // Persist newly unlocked achievements
  if (newlyUnlocked.length > 0) {
    var updatedUnlocked = unlocked.concat(newlyUnlocked);
    saveToStorage('unlockedAchievements', updatedUnlocked);
  }

  return newlyUnlocked;
}

// ─── Active Hobby Plan ───────────────────────────────────────────────────────

/**
 * Returns the active hobby data and today's task information.
 * @returns {Object|null} Object with hobby data and todayTask, or null if no active hobby.
 */
function getActiveHobbyPlan() {
  var activeHobbyId = getFromStorage('activeHobby', null);
  if (!activeHobbyId) return null;

  // HOBBIES is defined in data.js (loaded before utils.js)
  if (typeof HOBBIES === 'undefined') return null;

  var hobby = null;
  for (var i = 0; i < HOBBIES.length; i++) {
    if (HOBBIES[i].id === activeHobbyId) {
      hobby = HOBBIES[i];
      break;
    }
  }

  if (!hobby) return null;

  var progress = getFromStorage('hobbyProgress', {});
  var hobbyProgress = progress[activeHobbyId] || {
    completedDays: [],
    skippedDays: [],
    notes: {},
    startDate: new Date().toISOString().split('T')[0],
    weekNumber: 1
  };

  // Determine today's task (day number based on progress)
  var completedCount = hobbyProgress.completedDays.length;
  var skippedCount = hobbyProgress.skippedDays.length;
  var currentDay = completedCount + skippedCount + 1;

  // Clamp to plan length
  var plan = hobby.weekOnePlan || [];
  var todayTask = null;
  if (currentDay <= plan.length) {
    todayTask = plan[currentDay - 1];
  }

  return {
    hobby: hobby,
    progress: hobbyProgress,
    todayTask: todayTask,
    currentDay: currentDay
  };
}

// ─── Saved Hobbies Toggle ────────────────────────────────────────────────────

/**
 * Toggles a hobby ID in the savedHobbies array in localStorage.
 * If the hobby is already saved, it is removed. Otherwise, it is added and 5 coins awarded.
 * @param {string} hobbyId - The hobby ID to toggle.
 */
function toggleSavedHobby(hobbyId) {
  var saved = getFromStorage('savedHobbies', []);
  var index = saved.indexOf(hobbyId);

  if (index === -1) {
    // Add to saved
    saved.push(hobbyId);
    addCoins(5);
    showToast('Hobby saved!', 'success');
  } else {
    // Remove from saved
    saved.splice(index, 1);
    showToast('Hobby removed from saved.', 'info');
  }

  saveToStorage('savedHobbies', saved);
}
