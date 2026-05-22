/**
 * avatar-engine.js — Avatar Response Engine for StartHobby V1
 *
 * Provides keyword-match scripted responses for the coaching chat interface.
 * Matches user input against trigger keywords and returns contextual responses
 * with quick-reply chips.
 *
 * Exports global functions (no module system):
 * - getAvatarResponse(userInput, profile, plan) → { text, chips }
 * - getGreeting(profile, plan) → { text, chips }
 *
 * Loaded via <script> tag after data.js and utils.js.
 */

// ─── Flow Definitions ────────────────────────────────────────────────────────

/**
 * FLOWS defines the keyword-triggered response flows.
 * Each flow has:
 * - keywords: array of trigger words to match against lowercased input
 * - getResponse(profile, plan): function returning { text, chips }
 *
 * Flows are evaluated in order; the first match wins.
 */
var FLOWS = [
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'morning', 'afternoon', 'evening'],
    getResponse: function (profile, plan) {
      var name = (profile && profile.name) ? profile.name : 'there';
      var hobbyName = (plan && plan.hobby && plan.hobby.name) ? plan.hobby.name : 'your hobby';
      return {
        text: 'Hey ' + name + '! How is ' + hobbyName + ' going today?',
        chips: ["What's next?", "I'm stuck", "Motivate me"]
      };
    }
  },
  {
    id: 'nextStep',
    keywords: ['next', 'do', 'step'],
    getResponse: function (profile, plan) {
      if (plan && plan.todayTask) {
        return {
          text: "Your next task is: \"" + plan.todayTask.title + "\" — it should take about " + plan.todayTask.estimatedTime + ". You've got this!",
          chips: ["I completed today", "I'm stuck", "Show my plan"]
        };
      }
      return {
        text: "Looks like you've completed all tasks for this week! Take a moment to celebrate your progress.",
        chips: ["Show my plan", "Motivate me"]
      };
    }
  },
  {
    id: 'stuck',
    keywords: ['stuck', 'confused', 'unsure', 'lost'],
    getResponse: function (profile, plan) {
      if (plan && plan.hobby && plan.hobby.commonPitfalls && plan.hobby.commonPitfalls.length > 0) {
        var pitfall = plan.hobby.commonPitfalls[0];
        return {
          text: "A common issue is: \"" + pitfall.issue + "\". Here's a fix: " + pitfall.fix + ". Try that and let me know how it goes!",
          chips: ["What's next?", "I completed today", "Motivate me"]
        };
      }
      return {
        text: "It's totally normal to feel stuck when learning something new. Try breaking the task into smaller pieces, or revisit yesterday's progress for a confidence boost.",
        chips: ["What's next?", "Show my plan", "Motivate me"]
      };
    }
  },
  {
    id: 'motivation',
    keywords: ['quit', 'give up', 'hard', 'motivation', 'motivate'],
    getResponse: function (profile, plan) {
      var streakCount = (plan && plan.streak && plan.streak.current) ? plan.streak.current : 0;
      if (streakCount > 0) {
        return {
          text: "Don't give up! You're on a " + streakCount + "-day streak. Every expert was once a beginner. Keep showing up — that's what matters most.",
          chips: ["What's next?", "I completed today", "Show my plan"]
        };
      }
      return {
        text: "Every expert was once a beginner. The hardest part is starting — and you've already done that! Keep going, one small step at a time.",
        chips: ["What's next?", "I completed today", "Show my plan"]
      };
    }
  },
  {
    id: 'cost',
    keywords: ['cost', 'expensive', 'money', 'budget', 'cheap', 'afford'],
    getResponse: function (profile, plan) {
      var hobbyName = (plan && plan.hobby && plan.hobby.name) ? plan.hobby.name : 'this hobby';
      return {
        text: "Many people start " + hobbyName + " with minimal investment. Focus on the basics first — you can always upgrade gear later as you progress.",
        chips: ["What's next?", "Show my plan", "Motivate me"]
      };
    }
  },
  {
    id: 'time',
    keywords: ['time', 'busy', 'schedule', 'long', 'quick', 'minutes'],
    getResponse: function (profile, plan) {
      if (plan && plan.todayTask) {
        return {
          text: "Today's task should take about " + plan.todayTask.estimatedTime + ". Even 10 minutes of practice counts! Consistency beats intensity.",
          chips: ["What's next?", "I completed today", "I'm stuck"]
        };
      }
      return {
        text: "Even 10 minutes of practice counts! Consistency beats intensity. Try fitting in a quick session whenever you have a spare moment.",
        chips: ["What's next?", "Show my plan", "Motivate me"]
      };
    }
  },
  {
    id: 'milestone',
    keywords: ['milestone', 'goal', 'progress', 'achieve', 'achievement'],
    getResponse: function (profile, plan) {
      if (plan && plan.hobby && plan.hobby.milestones && plan.hobby.milestones.length > 0) {
        var nextMilestone = plan.hobby.milestones[0];
        return {
          text: "Your next milestone is: \"" + nextMilestone.label + "\" (" + nextMilestone.timeframe + "). " + nextMilestone.description + ". Keep at it!",
          chips: ["What's next?", "I completed today", "Motivate me"]
        };
      }
      return {
        text: "You're making great progress! Keep completing daily tasks and you'll hit your milestones before you know it.",
        chips: ["What's next?", "Show my plan", "Motivate me"]
      };
    }
  },
  {
    id: 'showPlan',
    keywords: ['plan', 'schedule', 'week', 'overview', 'tasks'],
    getResponse: function (profile, plan) {
      if (plan && plan.hobby && plan.hobby.weekOnePlan) {
        var completedCount = (plan.completedDays) ? plan.completedDays.length : 0;
        var totalDays = plan.hobby.weekOnePlan.length;
        return {
          text: "You've completed " + completedCount + " of " + totalDays + " days in your plan. Keep going — every day builds on the last!",
          chips: ["What's next?", "I completed today", "Motivate me"]
        };
      }
      return {
        text: "Head over to your plan page to see your full weekly schedule and track your progress!",
        chips: ["What's next?", "Motivate me"]
      };
    }
  },
  {
    id: 'completedToday',
    keywords: ['completed', 'done', 'finished', 'did it'],
    getResponse: function (profile, plan) {
      return {
        text: "Amazing work! 🎉 You've earned coins for completing today's task. Consistency is the key to mastery — see you tomorrow!",
        chips: ["What's next?", "Show my plan", "Motivate me"]
      };
    }
  },
  {
    id: 'easierVersion',
    keywords: ['easier', 'simpler', 'too hard', 'difficult', 'struggle', 'struggling'],
    getResponse: function (profile, plan) {
      return {
        text: "No worries! Try scaling back the task — do half the time or use simpler materials. Progress isn't always linear, and adapting is smart, not weak.",
        chips: ["What's next?", "I'm stuck", "Motivate me"]
      };
    }
  }
];

/**
 * Fallback response when no keyword matches.
 * @param {Object} profile - User profile object.
 * @param {Object} plan - Active plan object.
 * @returns {{ text: string, chips: string[] }}
 */
function getFallbackResponse(profile, plan) {
  return {
    text: "I'm here to help with your hobby journey! Try asking about your next step, or let me know if you're feeling stuck.",
    chips: ["What's next?", "I'm stuck", "I completed today", "Show my plan", "Motivate me"]
  };
}

// ─── Main Functions ──────────────────────────────────────────────────────────

/**
 * Matches user input against keyword triggers and returns the first matching
 * flow's response, or the fallback if no keywords match.
 *
 * @param {string} userInput - The user's message text.
 * @param {Object} profile - User profile object with name, goals, etc.
 * @param {Object} plan - Active plan object with hobby, todayTask, streak, completedDays.
 * @returns {{ text: string, chips: string[] }} Response object with text and quick-reply chips.
 */
function getAvatarResponse(userInput, profile, plan) {
  if (!userInput || typeof userInput !== 'string') {
    return getFallbackResponse(profile, plan);
  }

  var input = userInput.toLowerCase();

  for (var i = 0; i < FLOWS.length; i++) {
    var flow = FLOWS[i];
    for (var j = 0; j < flow.keywords.length; j++) {
      var keyword = flow.keywords[j];
      // Use word boundary regex for single-word keywords to avoid substring false positives
      // Multi-word keywords (e.g. "give up", "did it", "too hard") use indexOf for phrase matching
      if (keyword.indexOf(' ') !== -1) {
        if (input.indexOf(keyword) !== -1) {
          return flow.getResponse(profile, plan);
        }
      } else {
        var regex = new RegExp('\\b' + keyword + '\\b');
        if (regex.test(input)) {
          return flow.getResponse(profile, plan);
        }
      }
    }
  }

  return getFallbackResponse(profile, plan);
}

/**
 * Returns a personalized greeting message using the user's name and active hobby.
 *
 * @param {Object} profile - User profile object with name field.
 * @param {Object} plan - Active plan object with hobby field.
 * @returns {{ text: string, chips: string[] }} Greeting response with quick-reply chips.
 */
function getGreeting(profile, plan) {
  var name = (profile && profile.name) ? profile.name : 'there';
  var hobbyName = (plan && plan.hobby && plan.hobby.name) ? plan.hobby.name : 'your hobby';

  return {
    text: 'Hi ' + name + '! 👋 How is ' + hobbyName + ' going? I\'m here to help you stay on track.',
    chips: ["What's next?", "I'm stuck", "I completed today", "Show my plan", "Motivate me"]
  };
}
