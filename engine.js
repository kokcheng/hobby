/**
 * engine.js — Recommendation Scoring and Ranking for StartHobby V1
 *
 * Exports global functions (no module system):
 * - scoreHobby(hobby, profile) → Number
 * - rankHobbies(hobbies, profile) → Array
 * - getMatchReason(hobby, profile) → String
 *
 * Loaded via <script> tag after data.js and before page scripts.
 */

// ─── Recommendation Engine ───────────────────────────────────────────────────

/**
 * Scores a single hobby against the user profile.
 *
 * Hard filters (any violation → score 0):
 * - Budget "free" and hobby starterCost.min > 0
 * - Budget "<$50" and hobby starterCost.min > 50
 * - Time "<2hrs" and hobby timePerWeek.min >= 5
 * - Environment mismatch (unless either value is "both")
 * - Social mismatch (unless either value is "either");
 *   user "with-others" is treated as equivalent to hobby "social"
 *
 * Soft scoring (additive):
 * - +20 for beginner difficulty
 * - +30 if any hobby tag matches any user goal
 * - +10 for exact environment match
 * - +10 for exact social match (user "with-others" matches hobby "social")
 * - +10 for exact space match
 * - +10 if hobby starterCost.min === 0
 *
 * @param {Object} hobby - A hobby object from the catalog.
 * @param {Object} profile - The user profile from localStorage.
 * @returns {number} The computed score (0 if any hard filter violated).
 */
function scoreHobby(hobby, profile) {
  // ── Hard Filters ──────────────────────────────────────────────────────────

  // Budget filter: "free" means hobby must cost nothing
  if (profile.budget === "free" && hobby.starterCost.min > 0) {
    return 0;
  }

  // Budget filter: "<$50" means hobby starter cost must not exceed 50
  if (profile.budget === "<$50" && hobby.starterCost.min > 50) {
    return 0;
  }

  // Time filter: "<2hrs" means hobby must not require 5+ hours minimum
  if (profile.time === "<2hrs" && hobby.timePerWeek.min >= 5) {
    return 0;
  }

  // Environment filter: mismatch unless either side is "both"
  if (profile.env !== hobby.environment &&
      profile.env !== "both" &&
      hobby.environment !== "both") {
    return 0;
  }

  // Social filter: mismatch unless either side is "either"
  // Normalize: user "with-others" maps to hobby "social"
  var userSocial = profile.social === "with-others" ? "social" : profile.social;
  if (userSocial !== hobby.social &&
      userSocial !== "either" &&
      hobby.social !== "either") {
    return 0;
  }

  // ── Soft Scoring ──────────────────────────────────────────────────────────

  var score = 0;

  // +20 for beginner difficulty
  if (hobby.difficulty === "beginner") {
    score += 20;
  }

  // +30 if any hobby tag matches any user goal
  if (profile.goals && hobby.tags) {
    var tagMatch = false;
    for (var i = 0; i < hobby.tags.length; i++) {
      for (var j = 0; j < profile.goals.length; j++) {
        if (hobby.tags[i] === profile.goals[j]) {
          tagMatch = true;
          break;
        }
      }
      if (tagMatch) break;
    }
    if (tagMatch) {
      score += 30;
    }
  }

  // +10 for exact environment match
  if (profile.env === hobby.environment) {
    score += 10;
  }

  // +10 for exact social match (user "with-others" matches hobby "social")
  if (userSocial === hobby.social) {
    score += 10;
  }

  // +10 for exact space match
  if (profile.space === hobby.spaceNeeded) {
    score += 10;
  }

  // +10 if hobby has zero starter cost
  if (hobby.starterCost.min === 0) {
    score += 10;
  }

  return score;
}

/**
 * Ranks all hobbies against the user profile.
 *
 * Maps each hobby to include a matchScore, filters out zero-score hobbies,
 * and sorts the remaining hobbies in descending order by score.
 *
 * @param {Array} hobbies - Array of hobby objects from the catalog.
 * @param {Object} profile - The user profile from localStorage.
 * @returns {Array} Filtered and sorted array of hobby objects with matchScore attached.
 */
function rankHobbies(hobbies, profile) {
  var scored = [];

  for (var i = 0; i < hobbies.length; i++) {
    var hobby = hobbies[i];
    var score = scoreHobby(hobby, profile);
    if (score > 0) {
      // Create a shallow copy with matchScore attached
      var entry = {};
      for (var key in hobby) {
        if (hobby.hasOwnProperty(key)) {
          entry[key] = hobby[key];
        }
      }
      entry.matchScore = score;
      scored.push(entry);
    }
  }

  // Sort descending by matchScore
  scored.sort(function (a, b) {
    return b.matchScore - a.matchScore;
  });

  return scored;
}

/**
 * Returns a human-readable string explaining the best reason this hobby
 * matches the user's profile.
 *
 * Evaluates potential reasons in priority order (highest point value first)
 * and returns the first applicable reason.
 *
 * @param {Object} hobby - A hobby object from the catalog.
 * @param {Object} profile - The user profile from localStorage.
 * @returns {string} A match reason string.
 */
function getMatchReason(hobby, profile) {
  // Check tag/goal match first (+30 points — highest value)
  if (profile.goals && hobby.tags) {
    for (var i = 0; i < hobby.tags.length; i++) {
      for (var j = 0; j < profile.goals.length; j++) {
        if (hobby.tags[i] === profile.goals[j]) {
          var goal = profile.goals[j];
          // Map goal codes to human-readable labels
          var goalLabels = {
            "relax": "relaxation",
            "creative": "creative",
            "fit": "fitness",
            "meet-people": "social",
            "build-skill": "skill-building",
            "fun": "fun"
          };
          var label = goalLabels[goal] || goal;
          return "Matches your " + label + " goals";
        }
      }
    }
  }

  // Beginner difficulty (+20 points)
  if (hobby.difficulty === "beginner") {
    return "Perfect for beginners";
  }

  // Exact environment match (+10 points)
  if (profile.env === hobby.environment) {
    return "Fits your " + hobby.environment + " preference";
  }

  // Exact social match (+10 points)
  var userSocial = profile.social === "with-others" ? "social" : profile.social;
  if (userSocial === hobby.social) {
    return "Fits your " + profile.social + " preference";
  }

  // Exact space match (+10 points)
  if (profile.space === hobby.spaceNeeded) {
    return "Fits your available space";
  }

  // Zero starter cost (+10 points)
  if (hobby.starterCost.min === 0) {
    return "Zero cost to start";
  }

  // Fallback
  return "Great match for your profile";
}
