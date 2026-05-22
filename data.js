/**
 * data.js — Hobby Catalog, Achievements, and Rewards for StartHobby V1
 *
 * Exports global constants (no module system):
 * - HOBBIES: Array of 12 hobby objects covering all categories
 * - ACHIEVEMENTS: Array of 8 achievement definitions
 * - REWARDS: Array of 3 redeemable reward options
 *
 * Loaded via <script> tag before other modules.
 */

// ─── Hobby Catalog ───────────────────────────────────────────────────────────

const HOBBIES = [
  {
    id: "watercolour-painting",
    name: "Watercolour Painting",
    category: "Art",
    tags: ["creative", "relax", "build-skill"],
    difficulty: "beginner",
    timePerWeek: { min: 2, max: 4 },
    starterCost: { min: 15, max: 40 },
    environment: "indoor",
    social: "solo",
    spaceNeeded: "small",
    timeToFirstWin: "1 week",
    description: "Watercolour painting is a forgiving and expressive medium perfect for beginners. You can create beautiful washes and gradients with minimal supplies, and mistakes often become happy accidents.",
    equipment: [
      { item: "Watercolour pan set (12 colours)", required: true, cost: 12, alternative: "Individual tubes from art store" },
      { item: "Watercolour paper pad (A4)", required: true, cost: 8, alternative: "Mixed media sketchbook" },
      { item: "Round brush set (3 sizes)", required: true, cost: 10, alternative: "Single size 8 round brush" },
      { item: "Palette or white plate", required: false, cost: 5, alternative: "Old ceramic plate" }
    ],
    safetyNotes: [
      "Use non-toxic paints labelled AP or CP",
      "Work in a ventilated area if using fixative sprays"
    ],
    commonPitfalls: [
      { issue: "Using too much water and buckling paper", fix: "Tape paper edges to a board or use 300gsm paper" },
      { issue: "Overworking wet areas", fix: "Let each layer dry completely before adding more paint" }
    ],
    weekOnePlan: [
      { day: 1, title: "Set up your workspace", description: "Unpack supplies, fill a water jar, and practice loading your brush with water and paint.", estimatedTime: "20 min", coins: 30 },
      { day: 2, title: "Flat wash exercise", description: "Paint a smooth, even rectangle of colour across your paper. Focus on consistent brush strokes.", estimatedTime: "25 min", coins: 30 },
      { day: 3, title: "Gradient wash", description: "Create a wash that fades from dark to light by adding more water with each stroke.", estimatedTime: "25 min", coins: 30 },
      { day: 4, title: "Wet-on-wet technique", description: "Wet your paper first, then drop in colour and watch it bloom. Experiment with two colours.", estimatedTime: "30 min", coins: 30 },
      { day: 5, title: "Simple shapes", description: "Paint basic shapes — circles, squares, leaves — using the techniques you have learned.", estimatedTime: "30 min", coins: 30 },
      { day: 6, title: "Colour mixing", description: "Mix primary colours to create secondary colours. Document your mixes on a colour chart.", estimatedTime: "25 min", coins: 30 },
      { day: 7, title: "Paint a simple landscape", description: "Combine washes and shapes to paint a simple sky, hill, and tree scene.", estimatedTime: "40 min", coins: 30 }
    ],
    milestones: [
      { label: "First painting complete", timeframe: "Week 1", description: "Finish your first simple landscape painting" },
      { label: "Colour confidence", timeframe: "Month 1", description: "Complete 8 paintings using a full colour palette" },
      { label: "Share your work", timeframe: "3 months", description: "Post a painting online or gift one to a friend" }
    ],
    resources: {
      videos: [
        { title: "Watercolour Basics for Beginners", url: "https://www.youtube.com/watch?v=example1", duration: "15 min", level: "beginner", source: "YouTube" },
        { title: "Wet-on-Wet Technique Tutorial", url: "https://www.youtube.com/watch?v=example2", duration: "12 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "Getting Started with Watercolours", url: "https://example.com/watercolour-start", duration: "8 min read", level: "beginner", source: "ArtBlog" },
        { title: "10 Common Watercolour Mistakes", url: "https://example.com/watercolour-mistakes", duration: "5 min read", level: "beginner", source: "ArtBlog" }
      ],
      communities: [
        { title: "r/Watercolor", url: "https://reddit.com/r/watercolor", members: "250k", platform: "Reddit" },
        { title: "Watercolour Beginners Group", url: "https://facebook.com/groups/watercolour", members: "45k", platform: "Facebook" }
      ]
    }
  },
  {
    id: "ukulele",
    name: "Ukulele",
    category: "Music",
    tags: ["creative", "fun", "build-skill", "relax"],
    difficulty: "beginner",
    timePerWeek: { min: 2, max: 5 },
    starterCost: { min: 30, max: 60 },
    environment: "indoor",
    social: "either",
    spaceNeeded: "small",
    timeToFirstWin: "3 days",
    description: "The ukulele is one of the easiest instruments to pick up. With just four strings and simple chord shapes, you can play recognisable songs within your first week.",
    equipment: [
      { item: "Soprano ukulele", required: true, cost: 35, alternative: "Borrow from a friend or library" },
      { item: "Clip-on tuner", required: true, cost: 8, alternative: "Free tuner app on phone" },
      { item: "Chord chart poster", required: false, cost: 5, alternative: "Free printable online" },
      { item: "Gig bag", required: false, cost: 12, alternative: "Pillowcase for storage" }
    ],
    safetyNotes: [
      "Take breaks if fingertips become sore — calluses build over time",
      "Keep instrument away from extreme heat or humidity"
    ],
    commonPitfalls: [
      { issue: "Strings going out of tune constantly", fix: "New strings stretch — retune frequently for the first week" },
      { issue: "Muted or buzzy chords", fix: "Press strings firmly just behind the fret, not on top of it" }
    ],
    weekOnePlan: [
      { day: 1, title: "Tune and strum", description: "Tune your ukulele using a tuner app and practice a simple down-strum pattern on open strings.", estimatedTime: "15 min", coins: 30 },
      { day: 2, title: "Learn C and Am chords", description: "Practice switching between C major (one finger) and A minor (two fingers).", estimatedTime: "20 min", coins: 30 },
      { day: 3, title: "Learn F and G7 chords", description: "Add F major and G7 to your chord vocabulary. Practice switching between all four.", estimatedTime: "20 min", coins: 30 },
      { day: 4, title: "Strumming patterns", description: "Learn a down-down-up-up-down-up pattern and apply it to your chords.", estimatedTime: "20 min", coins: 30 },
      { day: 5, title: "Play your first song", description: "Play a simple 4-chord song (like 'Somewhere Over the Rainbow') slowly.", estimatedTime: "25 min", coins: 30 },
      { day: 6, title: "Smooth transitions", description: "Focus on switching chords without pausing. Use a metronome at slow tempo.", estimatedTime: "20 min", coins: 30 },
      { day: 7, title: "Perform for yourself", description: "Play your song from start to finish. Record yourself to hear your progress.", estimatedTime: "25 min", coins: 30 }
    ],
    milestones: [
      { label: "First song played", timeframe: "Week 1", description: "Play a complete song with chord changes" },
      { label: "5-song repertoire", timeframe: "Month 1", description: "Learn and play 5 different songs confidently" },
      { label: "Play for someone", timeframe: "3 months", description: "Perform a song for a friend or family member" }
    ],
    resources: {
      videos: [
        { title: "Ukulele in 10 Minutes", url: "https://www.youtube.com/watch?v=example3", duration: "10 min", level: "beginner", source: "YouTube" },
        { title: "4 Chords, 20 Songs", url: "https://www.youtube.com/watch?v=example4", duration: "18 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "Beginner Ukulele Chord Guide", url: "https://example.com/uke-chords", duration: "6 min read", level: "beginner", source: "UkeBlog" },
        { title: "How to Read Ukulele Tabs", url: "https://example.com/uke-tabs", duration: "4 min read", level: "beginner", source: "UkeBlog" }
      ],
      communities: [
        { title: "r/ukulele", url: "https://reddit.com/r/ukulele", members: "180k", platform: "Reddit" },
        { title: "Ukulele Underground Forum", url: "https://forum.ukuleleunderground.com", members: "90k", platform: "Forum" }
      ]
    }
  },
  {
    id: "bodyweight-fitness",
    name: "Bodyweight Fitness",
    category: "Fitness",
    tags: ["fit", "build-skill", "fun"],
    difficulty: "beginner",
    timePerWeek: { min: 3, max: 5 },
    starterCost: { min: 0, max: 20 },
    environment: "indoor",
    social: "solo",
    spaceNeeded: "room",
    timeToFirstWin: "1 week",
    description: "Build strength and flexibility using only your body. No gym membership needed — just a small space and consistency. Progress is measurable and motivating from day one.",
    equipment: [
      { item: "Exercise mat", required: false, cost: 15, alternative: "Towel on carpet" },
      { item: "Pull-up bar (doorframe)", required: false, cost: 20, alternative: "Use a sturdy tree branch or playground bar" },
      { item: "Resistance band", required: false, cost: 8, alternative: "Use bodyweight progressions instead" }
    ],
    safetyNotes: [
      "Warm up for 5 minutes before each session",
      "Stop if you feel sharp pain — muscle soreness is normal, joint pain is not",
      "Stay hydrated throughout your workout"
    ],
    commonPitfalls: [
      { issue: "Doing too much too soon", fix: "Start with the easiest progression and add reps before advancing" },
      { issue: "Skipping rest days", fix: "Muscles grow during rest — take at least one day off between sessions" }
    ],
    weekOnePlan: [
      { day: 1, title: "Movement assessment", description: "Test how many push-ups, squats, and seconds of plank you can do. Record your baseline.", estimatedTime: "20 min", coins: 30 },
      { day: 2, title: "Push day basics", description: "3 sets of wall push-ups or knee push-ups. Focus on full range of motion.", estimatedTime: "25 min", coins: 30 },
      { day: 3, title: "Rest and stretch", description: "Gentle full-body stretching routine. Hold each stretch for 30 seconds.", estimatedTime: "15 min", coins: 30 },
      { day: 4, title: "Pull and core", description: "3 sets of inverted rows (under a table) and 3 sets of dead bugs for core.", estimatedTime: "25 min", coins: 30 },
      { day: 5, title: "Leg day", description: "3 sets of bodyweight squats, lunges, and glute bridges.", estimatedTime: "25 min", coins: 30 },
      { day: 6, title: "Rest and mobility", description: "Hip opener stretches and shoulder mobility drills.", estimatedTime: "15 min", coins: 30 },
      { day: 7, title: "Full body circuit", description: "Combine one exercise from each day into a circuit. 3 rounds with 60s rest.", estimatedTime: "30 min", coins: 30 }
    ],
    milestones: [
      { label: "First full push-up", timeframe: "Week 1", description: "Complete one full push-up with good form" },
      { label: "Consistent routine", timeframe: "Month 1", description: "Complete 12 workouts in 4 weeks" },
      { label: "Strength milestone", timeframe: "3 months", description: "Double your baseline numbers from day 1" }
    ],
    resources: {
      videos: [
        { title: "Beginner Bodyweight Routine", url: "https://www.youtube.com/watch?v=example5", duration: "20 min", level: "beginner", source: "YouTube" },
        { title: "Perfect Push-Up Form", url: "https://www.youtube.com/watch?v=example6", duration: "8 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "Reddit Recommended Routine", url: "https://example.com/bwf-routine", duration: "10 min read", level: "beginner", source: "r/bodyweightfitness" },
        { title: "Progression Guide for Beginners", url: "https://example.com/bwf-progressions", duration: "7 min read", level: "beginner", source: "FitnessBlog" }
      ],
      communities: [
        { title: "r/bodyweightfitness", url: "https://reddit.com/r/bodyweightfitness", members: "2.5M", platform: "Reddit" },
        { title: "Calisthenics Movement Community", url: "https://facebook.com/groups/calisthenics", members: "120k", platform: "Facebook" }
      ]
    }
  },
  {
    id: "hiking",
    name: "Hiking",
    category: "Outdoor",
    tags: ["fit", "relax", "fun", "meet-people"],
    difficulty: "beginner",
    timePerWeek: { min: 2, max: 6 },
    starterCost: { min: 0, max: 30 },
    environment: "outdoor",
    social: "either",
    spaceNeeded: "outside",
    timeToFirstWin: "1 day",
    description: "Hiking connects you with nature while building endurance. Start with easy local trails and gradually tackle longer routes. It is free, accessible, and endlessly varied.",
    equipment: [
      { item: "Comfortable walking shoes", required: true, cost: 0, alternative: "Any sturdy trainers you already own" },
      { item: "Water bottle (1L)", required: true, cost: 10, alternative: "Any reusable bottle from home" },
      { item: "Small daypack", required: false, cost: 25, alternative: "Any backpack you have" },
      { item: "Trail map or app", required: false, cost: 0, alternative: "AllTrails free version" }
    ],
    safetyNotes: [
      "Tell someone your planned route and expected return time",
      "Check weather forecast before heading out",
      "Carry more water than you think you need",
      "Start with well-marked, popular trails"
    ],
    commonPitfalls: [
      { issue: "Choosing a trail that is too long for your fitness", fix: "Start with trails under 5km and less than 200m elevation gain" },
      { issue: "Not bringing enough water", fix: "Carry at least 500ml per hour of hiking in warm weather" }
    ],
    weekOnePlan: [
      { day: 1, title: "Find local trails", description: "Research 3 beginner-friendly trails within 30 minutes of your home using AllTrails or a local guide.", estimatedTime: "20 min", coins: 30 },
      { day: 2, title: "Gear check", description: "Lay out your shoes, water bottle, and a snack. Test your shoes on a short 15-minute walk.", estimatedTime: "20 min", coins: 30 },
      { day: 3, title: "First short hike", description: "Walk a flat, easy trail of 2-3km. Focus on enjoying the surroundings, not speed.", estimatedTime: "45 min", coins: 30 },
      { day: 4, title: "Rest and reflect", description: "Note what you enjoyed and what gear worked well. Look up your next trail.", estimatedTime: "10 min", coins: 30 },
      { day: 5, title: "Slightly longer hike", description: "Try a 4-5km trail with gentle elevation. Practice pacing yourself.", estimatedTime: "60 min", coins: 30 },
      { day: 6, title: "Learn trail etiquette", description: "Read about Leave No Trace principles and trail right-of-way rules.", estimatedTime: "15 min", coins: 30 },
      { day: 7, title: "Social hike", description: "Invite a friend or join a local hiking group for a beginner trail.", estimatedTime: "60 min", coins: 30 }
    ],
    milestones: [
      { label: "First trail completed", timeframe: "Week 1", description: "Complete your first proper trail hike" },
      { label: "10km total distance", timeframe: "Month 1", description: "Accumulate 10km of trail distance across multiple hikes" },
      { label: "Summit a local peak", timeframe: "3 months", description: "Complete a hike with significant elevation to a viewpoint or summit" }
    ],
    resources: {
      videos: [
        { title: "Hiking Tips for Beginners", url: "https://www.youtube.com/watch?v=example7", duration: "12 min", level: "beginner", source: "YouTube" },
        { title: "What to Pack for a Day Hike", url: "https://www.youtube.com/watch?v=example8", duration: "9 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "Beginner Hiking Checklist", url: "https://example.com/hiking-checklist", duration: "5 min read", level: "beginner", source: "OutdoorBlog" },
        { title: "How to Use AllTrails", url: "https://example.com/alltrails-guide", duration: "4 min read", level: "beginner", source: "OutdoorBlog" }
      ],
      communities: [
        { title: "r/hiking", url: "https://reddit.com/r/hiking", members: "1.8M", platform: "Reddit" },
        { title: "Local Hiking Meetup Groups", url: "https://meetup.com/topics/hiking", members: "varies", platform: "Meetup" }
      ]
    }
  },
  {
    id: "creative-writing",
    name: "Creative Writing",
    category: "Creative",
    tags: ["creative", "relax", "build-skill"],
    difficulty: "beginner",
    timePerWeek: { min: 2, max: 4 },
    starterCost: { min: 0, max: 10 },
    environment: "indoor",
    social: "solo",
    spaceNeeded: "small",
    timeToFirstWin: "1 day",
    description: "Express yourself through stories, poetry, or journaling. Creative writing requires nothing but your thoughts and a way to capture them. It builds clarity, empathy, and imagination.",
    equipment: [
      { item: "Notebook or journal", required: false, cost: 5, alternative: "Any paper or a free notes app" },
      { item: "Pen you enjoy writing with", required: false, cost: 3, alternative: "Any pen or pencil" },
      { item: "Writing app (Google Docs)", required: false, cost: 0, alternative: "Phone notes app" }
    ],
    safetyNotes: [
      "Take breaks to avoid repetitive strain — stretch your hands every 30 minutes",
      "Writing about difficult emotions can be intense — pace yourself"
    ],
    commonPitfalls: [
      { issue: "Waiting for inspiration to strike", fix: "Write at the same time daily — inspiration follows routine" },
      { issue: "Editing while writing first drafts", fix: "Separate writing and editing into different sessions" }
    ],
    weekOnePlan: [
      { day: 1, title: "Freewrite for 10 minutes", description: "Set a timer and write without stopping. Do not edit or judge — just let words flow.", estimatedTime: "15 min", coins: 30 },
      { day: 2, title: "Describe a memory", description: "Write about a vivid childhood memory using all five senses.", estimatedTime: "20 min", coins: 30 },
      { day: 3, title: "Character sketch", description: "Invent a character. Describe their appearance, habits, fears, and a secret they keep.", estimatedTime: "20 min", coins: 30 },
      { day: 4, title: "Dialogue exercise", description: "Write a conversation between two characters who disagree about something small.", estimatedTime: "20 min", coins: 30 },
      { day: 5, title: "Flash fiction", description: "Write a complete story in exactly 100 words. Every word must earn its place.", estimatedTime: "25 min", coins: 30 },
      { day: 6, title: "Poetry attempt", description: "Write a short poem (haiku or free verse) about something you saw today.", estimatedTime: "15 min", coins: 30 },
      { day: 7, title: "Reflect and plan", description: "Re-read your week's writing. Note what you enjoyed most and plan next week's focus.", estimatedTime: "20 min", coins: 30 }
    ],
    milestones: [
      { label: "First piece finished", timeframe: "Week 1", description: "Complete a flash fiction story or poem" },
      { label: "Writing habit formed", timeframe: "Month 1", description: "Write at least 20 out of 30 days" },
      { label: "Share your work", timeframe: "3 months", description: "Submit a piece to a writing community or share with a friend" }
    ],
    resources: {
      videos: [
        { title: "Creative Writing for Beginners", url: "https://www.youtube.com/watch?v=example9", duration: "14 min", level: "beginner", source: "YouTube" },
        { title: "How to Write Flash Fiction", url: "https://www.youtube.com/watch?v=example10", duration: "11 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "50 Creative Writing Prompts", url: "https://example.com/writing-prompts", duration: "3 min read", level: "beginner", source: "WritingBlog" },
        { title: "Building a Daily Writing Habit", url: "https://example.com/writing-habit", duration: "6 min read", level: "beginner", source: "WritingBlog" }
      ],
      communities: [
        { title: "r/WritingPrompts", url: "https://reddit.com/r/WritingPrompts", members: "16M", platform: "Reddit" },
        { title: "NaNoWriMo Community", url: "https://nanowrimo.org/community", members: "500k", platform: "Web" }
      ]
    }
  },
  {
    id: "knitting",
    name: "Knitting",
    category: "Craft",
    tags: ["creative", "relax", "build-skill"],
    difficulty: "beginner",
    timePerWeek: { min: 2, max: 6 },
    starterCost: { min: 10, max: 25 },
    environment: "indoor",
    social: "either",
    spaceNeeded: "small",
    timeToFirstWin: "2 days",
    description: "Knitting is meditative, portable, and produces tangible results. Start with a simple scarf and progress to hats, socks, and sweaters. The rhythmic motion is deeply calming.",
    equipment: [
      { item: "Knitting needles (size 8/5mm)", required: true, cost: 6, alternative: "Bamboo needles from craft store" },
      { item: "Worsted weight yarn (1 skein)", required: true, cost: 8, alternative: "Acrylic yarn from discount store" },
      { item: "Scissors", required: true, cost: 0, alternative: "Any household scissors" },
      { item: "Tapestry needle", required: false, cost: 3, alternative: "Large sewing needle" }
    ],
    safetyNotes: [
      "Take breaks every 30 minutes to stretch hands and wrists",
      "Keep needles stored safely away from small children and pets"
    ],
    commonPitfalls: [
      { issue: "Stitches too tight to work", fix: "Relax your grip — yarn should slide freely on needles" },
      { issue: "Accidentally adding extra stitches", fix: "Count stitches at the end of every row until it becomes habit" }
    ],
    weekOnePlan: [
      { day: 1, title: "Cast on", description: "Learn the long-tail cast on method. Practice casting on 20 stitches.", estimatedTime: "20 min", coins: 30 },
      { day: 2, title: "Knit stitch", description: "Learn the knit stitch and practice one full row. Do not worry about evenness yet.", estimatedTime: "25 min", coins: 30 },
      { day: 3, title: "Practice rows", description: "Knit 10 rows in garter stitch (all knit). Focus on consistent tension.", estimatedTime: "30 min", coins: 30 },
      { day: 4, title: "Purl stitch", description: "Learn the purl stitch. Practice alternating knit and purl rows (stockinette).", estimatedTime: "25 min", coins: 30 },
      { day: 5, title: "Continue your swatch", description: "Knit a 4-inch square swatch combining knit and purl. This is your practice piece.", estimatedTime: "30 min", coins: 30 },
      { day: 6, title: "Cast off", description: "Learn to bind off (cast off) your stitches to finish a piece.", estimatedTime: "20 min", coins: 30 },
      { day: 7, title: "Start a scarf", description: "Cast on 30 stitches and begin your first real project — a simple garter stitch scarf.", estimatedTime: "30 min", coins: 30 }
    ],
    milestones: [
      { label: "First swatch complete", timeframe: "Week 1", description: "Finish a practice swatch with both knit and purl stitches" },
      { label: "First project done", timeframe: "Month 1", description: "Complete your first scarf or dishcloth" },
      { label: "Gift something handmade", timeframe: "3 months", description: "Knit and gift a hat or scarf to someone" }
    ],
    resources: {
      videos: [
        { title: "Learn to Knit for Beginners", url: "https://www.youtube.com/watch?v=example11", duration: "22 min", level: "beginner", source: "YouTube" },
        { title: "Knit Stitch vs Purl Stitch", url: "https://www.youtube.com/watch?v=example12", duration: "10 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "Beginner Knitting Patterns", url: "https://example.com/knitting-patterns", duration: "5 min read", level: "beginner", source: "CraftBlog" },
        { title: "Choosing Your First Yarn", url: "https://example.com/yarn-guide", duration: "4 min read", level: "beginner", source: "CraftBlog" }
      ],
      communities: [
        { title: "r/knitting", url: "https://reddit.com/r/knitting", members: "600k", platform: "Reddit" },
        { title: "Ravelry", url: "https://ravelry.com", members: "9M", platform: "Web" }
      ]
    }
  },
  {
    id: "chess",
    name: "Chess",
    category: "Strategy",
    tags: ["build-skill", "fun", "meet-people"],
    difficulty: "beginner",
    timePerWeek: { min: 2, max: 5 },
    starterCost: { min: 0, max: 0 },
    environment: "indoor",
    social: "social",
    spaceNeeded: "small",
    timeToFirstWin: "1 day",
    description: "Chess sharpens strategic thinking, pattern recognition, and patience. Play online for free against people worldwide or study puzzles to improve. Every game teaches something new.",
    equipment: [
      { item: "Chess.com or Lichess account (free)", required: true, cost: 0, alternative: "Physical chess set from a charity shop" },
      { item: "Notebook for game notes", required: false, cost: 3, alternative: "Phone notes app" }
    ],
    safetyNotes: [
      "Set time limits on online play to avoid excessive screen time",
      "Take breaks between games to avoid mental fatigue"
    ],
    commonPitfalls: [
      { issue: "Playing too fast and blundering pieces", fix: "Play longer time controls (10+ minutes) and check for threats before moving" },
      { issue: "Getting discouraged by losses", fix: "Review each loss to find one lesson — every game is a learning opportunity" }
    ],
    weekOnePlan: [
      { day: 1, title: "Learn piece movements", description: "Learn how each piece moves: pawn, rook, knight, bishop, queen, king.", estimatedTime: "20 min", coins: 30 },
      { day: 2, title: "Special moves", description: "Learn castling, en passant, and pawn promotion rules.", estimatedTime: "15 min", coins: 30 },
      { day: 3, title: "Play your first game", description: "Play a game against the computer on the easiest setting. Focus on not hanging pieces.", estimatedTime: "20 min", coins: 30 },
      { day: 4, title: "Basic tactics: forks", description: "Learn what a fork is and solve 10 fork puzzles on Chess.com or Lichess.", estimatedTime: "20 min", coins: 30 },
      { day: 5, title: "Basic tactics: pins", description: "Learn what a pin is and solve 10 pin puzzles.", estimatedTime: "20 min", coins: 30 },
      { day: 6, title: "Opening principles", description: "Learn 3 opening principles: control the centre, develop pieces, castle early.", estimatedTime: "15 min", coins: 30 },
      { day: 7, title: "Play a rated game", description: "Play your first rated game online. Apply opening principles and look for tactics.", estimatedTime: "25 min", coins: 30 }
    ],
    milestones: [
      { label: "First game completed", timeframe: "Week 1", description: "Play and finish a full chess game" },
      { label: "50 puzzles solved", timeframe: "Month 1", description: "Solve 50 tactical puzzles on a chess platform" },
      { label: "Beat a higher-rated player", timeframe: "3 months", description: "Win a game against someone rated above you" }
    ],
    resources: {
      videos: [
        { title: "Chess Fundamentals for Beginners", url: "https://www.youtube.com/watch?v=example13", duration: "25 min", level: "beginner", source: "YouTube" },
        { title: "Top 5 Opening Traps", url: "https://www.youtube.com/watch?v=example14", duration: "14 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "How to Get Started with Chess", url: "https://example.com/chess-start", duration: "7 min read", level: "beginner", source: "ChessBlog" },
        { title: "Understanding Chess Ratings", url: "https://example.com/chess-ratings", duration: "4 min read", level: "beginner", source: "ChessBlog" }
      ],
      communities: [
        { title: "r/chess", url: "https://reddit.com/r/chess", members: "1.2M", platform: "Reddit" },
        { title: "Lichess Community", url: "https://lichess.org/team", members: "3M", platform: "Lichess" }
      ]
    }
  },
  {
    id: "meditation",
    name: "Meditation",
    category: "Wellbeing",
    tags: ["relax", "fun"],
    difficulty: "beginner",
    timePerWeek: { min: 1, max: 3 },
    starterCost: { min: 0, max: 0 },
    environment: "indoor",
    social: "solo",
    spaceNeeded: "small",
    timeToFirstWin: "1 day",
    description: "Meditation reduces stress, improves focus, and builds emotional resilience. Start with just 5 minutes a day of guided breathing. No equipment, no cost, no special space needed.",
    equipment: [
      { item: "Quiet space", required: true, cost: 0, alternative: "Use noise-cancelling earbuds" },
      { item: "Timer or meditation app", required: false, cost: 0, alternative: "Phone timer works fine" },
      { item: "Cushion or chair", required: false, cost: 0, alternative: "Sit on your bed or floor" }
    ],
    safetyNotes: [
      "If meditation brings up difficult emotions, it is okay to stop and try again later",
      "Do not meditate while driving or operating machinery"
    ],
    commonPitfalls: [
      { issue: "Thinking you are doing it wrong because your mind wanders", fix: "Mind wandering is normal — noticing it and returning to breath IS the practice" },
      { issue: "Trying to meditate for too long too soon", fix: "Start with 5 minutes. Consistency matters more than duration" }
    ],
    weekOnePlan: [
      { day: 1, title: "5-minute breathing", description: "Sit comfortably, close your eyes, and focus on your breath for 5 minutes. Count each exhale up to 10, then restart.", estimatedTime: "5 min", coins: 30 },
      { day: 2, title: "Body scan", description: "Lie down and slowly bring attention to each body part from toes to head. Notice sensations without judging.", estimatedTime: "10 min", coins: 30 },
      { day: 3, title: "Guided meditation", description: "Follow a free guided meditation (YouTube or Insight Timer app). Let the voice lead you.", estimatedTime: "10 min", coins: 30 },
      { day: 4, title: "Walking meditation", description: "Walk slowly for 5 minutes, paying attention to each step and the sensation of your feet on the ground.", estimatedTime: "10 min", coins: 30 },
      { day: 5, title: "Breath counting", description: "Sit for 7 minutes. Count breaths 1-10, restart if you lose count. Notice how focus improves.", estimatedTime: "7 min", coins: 30 },
      { day: 6, title: "Gratitude meditation", description: "Spend 5 minutes thinking of 3 things you are grateful for. Sit with the feeling of each one.", estimatedTime: "7 min", coins: 30 },
      { day: 7, title: "Unguided sit", description: "Sit for 10 minutes with no guidance. Simply observe your breath and thoughts without attachment.", estimatedTime: "10 min", coins: 30 }
    ],
    milestones: [
      { label: "7-day streak", timeframe: "Week 1", description: "Meditate every day for one full week" },
      { label: "15-minute session", timeframe: "Month 1", description: "Complete a single 15-minute meditation session" },
      { label: "Mindfulness habit", timeframe: "3 months", description: "Meditate at least 5 days per week for 3 months" }
    ],
    resources: {
      videos: [
        { title: "Meditation for Beginners", url: "https://www.youtube.com/watch?v=example15", duration: "10 min", level: "beginner", source: "YouTube" },
        { title: "How Meditation Changes Your Brain", url: "https://www.youtube.com/watch?v=example16", duration: "8 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "A Beginner's Guide to Meditation", url: "https://example.com/meditation-guide", duration: "6 min read", level: "beginner", source: "WellnessBlog" },
        { title: "5 Types of Meditation Explained", url: "https://example.com/meditation-types", duration: "5 min read", level: "beginner", source: "WellnessBlog" }
      ],
      communities: [
        { title: "r/Meditation", url: "https://reddit.com/r/Meditation", members: "800k", platform: "Reddit" },
        { title: "Insight Timer Community", url: "https://insighttimer.com/community", members: "20M", platform: "App" }
      ]
    }
  },
  {
    id: "digital-photography",
    name: "Digital Photography",
    category: "Art",
    tags: ["creative", "build-skill", "fun"],
    difficulty: "intermediate",
    timePerWeek: { min: 3, max: 6 },
    starterCost: { min: 0, max: 50 },
    environment: "both",
    social: "solo",
    spaceNeeded: "outside",
    timeToFirstWin: "1 day",
    description: "Photography trains you to see the world differently. Start with your phone camera and learn composition, lighting, and storytelling through images. No expensive gear required.",
    equipment: [
      { item: "Smartphone with camera", required: true, cost: 0, alternative: "Any phone made in the last 5 years" },
      { item: "Photo editing app (Snapseed)", required: false, cost: 0, alternative: "Phone's built-in editor" },
      { item: "Small tripod or phone mount", required: false, cost: 15, alternative: "Lean phone against stable objects" },
      { item: "Dedicated camera", required: false, cost: 50, alternative: "Start with phone, upgrade later" }
    ],
    safetyNotes: [
      "Be aware of your surroundings when shooting — do not step into traffic or off edges",
      "Ask permission before photographing people, especially children",
      "Protect your equipment from rain and extreme temperatures"
    ],
    commonPitfalls: [
      { issue: "Thinking you need expensive gear to start", fix: "Phone cameras are excellent — focus on composition and light first" },
      { issue: "Only shooting in auto mode", fix: "Learn the rule of thirds and experiment with manual exposure settings" }
    ],
    weekOnePlan: [
      { day: 1, title: "Rule of thirds", description: "Enable grid lines on your camera. Take 10 photos placing subjects on grid intersections.", estimatedTime: "25 min", coins: 30 },
      { day: 2, title: "Golden hour shoot", description: "Photograph outdoors during the first or last hour of sunlight. Notice how warm light changes everything.", estimatedTime: "30 min", coins: 30 },
      { day: 3, title: "Leading lines", description: "Find and photograph 5 examples of leading lines (roads, fences, rivers) that draw the eye.", estimatedTime: "25 min", coins: 30 },
      { day: 4, title: "Close-up details", description: "Get close to small subjects — textures, flowers, food. Fill the frame with detail.", estimatedTime: "20 min", coins: 30 },
      { day: 5, title: "Light and shadow", description: "Find interesting shadows or light patterns. Photograph the contrast between light and dark.", estimatedTime: "25 min", coins: 30 },
      { day: 6, title: "Edit your favourites", description: "Choose your 3 best photos from the week. Edit them using Snapseed or your phone editor.", estimatedTime: "30 min", coins: 30 },
      { day: 7, title: "Create a mini portfolio", description: "Select your 5 best edited photos and arrange them in an album. Share one online.", estimatedTime: "20 min", coins: 30 }
    ],
    milestones: [
      { label: "First edited photo", timeframe: "Week 1", description: "Take and edit a photo you are proud of" },
      { label: "Photo-a-day streak", timeframe: "Month 1", description: "Take at least one intentional photo every day for 30 days" },
      { label: "Portfolio of 20", timeframe: "3 months", description: "Build a curated portfolio of 20 of your best photographs" }
    ],
    resources: {
      videos: [
        { title: "Phone Photography Masterclass", url: "https://www.youtube.com/watch?v=example17", duration: "20 min", level: "beginner", source: "YouTube" },
        { title: "Understanding Light in Photography", url: "https://www.youtube.com/watch?v=example18", duration: "15 min", level: "intermediate", source: "YouTube" }
      ],
      articles: [
        { title: "Composition Rules Every Photographer Should Know", url: "https://example.com/photo-composition", duration: "8 min read", level: "beginner", source: "PhotoBlog" },
        { title: "Editing Photos on Your Phone", url: "https://example.com/phone-editing", duration: "6 min read", level: "beginner", source: "PhotoBlog" }
      ],
      communities: [
        { title: "r/photography", url: "https://reddit.com/r/photography", members: "5M", platform: "Reddit" },
        { title: "500px Community", url: "https://500px.com", members: "15M", platform: "Web" }
      ]
    }
  },
  {
    id: "indoor-rock-climbing",
    name: "Indoor Rock Climbing",
    category: "Fitness",
    tags: ["fit", "fun", "meet-people", "build-skill"],
    difficulty: "intermediate",
    timePerWeek: { min: 3, max: 6 },
    starterCost: { min: 30, max: 80 },
    environment: "indoor",
    social: "social",
    spaceNeeded: "outside",
    timeToFirstWin: "1 day",
    description: "Indoor climbing is a full-body workout disguised as a puzzle. Each route is a problem to solve with your body. The community is welcoming and progress is visible on the wall.",
    equipment: [
      { item: "Climbing shoes (rental available)", required: true, cost: 0, alternative: "Rent at the gym for first month" },
      { item: "Chalk bag", required: false, cost: 12, alternative: "Gym provides communal chalk" },
      { item: "Gym membership or day pass", required: true, cost: 30, alternative: "Look for introductory offers" },
      { item: "Comfortable athletic clothing", required: true, cost: 0, alternative: "Any stretchy clothes you own" }
    ],
    safetyNotes: [
      "Always check mats are in place before bouldering",
      "Learn to fall safely — land on your feet and roll backward",
      "Warm up thoroughly before climbing — cold muscles tear easily",
      "Do not climb directly below another climber"
    ],
    commonPitfalls: [
      { issue: "Relying too much on arm strength", fix: "Keep arms straight when resting and push with your legs — they are much stronger" },
      { issue: "Getting pumped (forearm fatigue) too quickly", fix: "Shake out each arm regularly and focus on efficient movement" }
    ],
    weekOnePlan: [
      { day: 1, title: "Gym orientation", description: "Visit a climbing gym. Get a day pass, rent shoes, and learn the rules and grading system.", estimatedTime: "60 min", coins: 30 },
      { day: 2, title: "Easy routes", description: "Climb 5 of the easiest routes (V0 or 5.6). Focus on using your legs, not just arms.", estimatedTime: "60 min", coins: 30 },
      { day: 3, title: "Rest and research", description: "Watch climbing technique videos. Learn about flagging, drop knees, and body positioning.", estimatedTime: "20 min", coins: 30 },
      { day: 4, title: "Technique focus", description: "Return to the gym. Climb the same routes but focus on quiet feet and smooth movement.", estimatedTime: "60 min", coins: 30 },
      { day: 5, title: "Try harder routes", description: "Attempt 2-3 routes one grade above your comfort level. It is okay to fall.", estimatedTime: "60 min", coins: 30 },
      { day: 6, title: "Rest and stretch", description: "Full body stretching with focus on forearms, shoulders, and hips.", estimatedTime: "20 min", coins: 30 },
      { day: 7, title: "Social climb", description: "Talk to other climbers or join a beginner session. Ask for beta (advice) on a route.", estimatedTime: "60 min", coins: 30 }
    ],
    milestones: [
      { label: "First route topped", timeframe: "Week 1", description: "Complete your first climbing route from bottom to top" },
      { label: "Grade progression", timeframe: "Month 1", description: "Consistently climb one grade above where you started" },
      { label: "Project send", timeframe: "3 months", description: "Complete a route that took multiple sessions to figure out" }
    ],
    resources: {
      videos: [
        { title: "Climbing Technique for Beginners", url: "https://www.youtube.com/watch?v=example19", duration: "18 min", level: "beginner", source: "YouTube" },
        { title: "How to Read Climbing Routes", url: "https://www.youtube.com/watch?v=example20", duration: "12 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "Your First Day at a Climbing Gym", url: "https://example.com/climbing-first-day", duration: "6 min read", level: "beginner", source: "ClimbBlog" },
        { title: "Climbing Grades Explained", url: "https://example.com/climbing-grades", duration: "4 min read", level: "beginner", source: "ClimbBlog" }
      ],
      communities: [
        { title: "r/climbing", url: "https://reddit.com/r/climbing", members: "500k", platform: "Reddit" },
        { title: "Mountain Project Forum", url: "https://mountainproject.com/forum", members: "200k", platform: "Web" }
      ]
    }
  },
  {
    id: "gardening",
    name: "Container Gardening",
    category: "Outdoor",
    tags: ["relax", "creative", "fun"],
    difficulty: "beginner",
    timePerWeek: { min: 1, max: 3 },
    starterCost: { min: 10, max: 30 },
    environment: "outdoor",
    social: "solo",
    spaceNeeded: "small",
    timeToFirstWin: "1 week",
    description: "Grow herbs, flowers, or vegetables in pots on a balcony, windowsill, or small patio. Container gardening is accessible, rewarding, and connects you to natural cycles.",
    equipment: [
      { item: "2-3 pots with drainage holes", required: true, cost: 8, alternative: "Drill holes in old buckets or tins" },
      { item: "Potting soil (small bag)", required: true, cost: 6, alternative: "Mix garden soil with compost" },
      { item: "Seeds or seedlings (herbs)", required: true, cost: 5, alternative: "Regrow kitchen scraps (green onions, basil)" },
      { item: "Watering can", required: false, cost: 5, alternative: "Any jug or bottle with holes in lid" }
    ],
    safetyNotes: [
      "Wash hands after handling soil",
      "Check if plants are toxic to pets before bringing them home",
      "Use gloves when handling fertiliser"
    ],
    commonPitfalls: [
      { issue: "Overwatering plants", fix: "Stick your finger 2cm into soil — only water if it feels dry" },
      { issue: "Not enough sunlight", fix: "Most herbs need 6+ hours of sun — place pots in your sunniest spot" }
    ],
    weekOnePlan: [
      { day: 1, title: "Choose your plants", description: "Research 3 easy container plants for your climate. Basil, mint, and cherry tomatoes are great starters.", estimatedTime: "20 min", coins: 30 },
      { day: 2, title: "Get supplies", description: "Buy or gather pots, soil, and seeds/seedlings. Set up your growing area.", estimatedTime: "30 min", coins: 30 },
      { day: 3, title: "Plant your containers", description: "Fill pots with soil, plant seeds or seedlings at the correct depth, and water gently.", estimatedTime: "25 min", coins: 30 },
      { day: 4, title: "Learn watering basics", description: "Check soil moisture and water if needed. Learn the signs of over and under-watering.", estimatedTime: "10 min", coins: 30 },
      { day: 5, title: "Observe and journal", description: "Check your plants for growth. Start a simple garden journal noting what you see.", estimatedTime: "10 min", coins: 30 },
      { day: 6, title: "Learn about feeding", description: "Research when and how to fertilise container plants. Most need feeding every 2 weeks.", estimatedTime: "15 min", coins: 30 },
      { day: 7, title: "Plan your next planting", description: "Research companion planting and plan what to grow next. Check your plants' progress.", estimatedTime: "15 min", coins: 30 }
    ],
    milestones: [
      { label: "Seeds planted", timeframe: "Week 1", description: "Plant your first containers and establish a watering routine" },
      { label: "First harvest", timeframe: "Month 1", description: "Harvest your first herbs or see flowers bloom" },
      { label: "Expanded garden", timeframe: "3 months", description: "Grow 5+ different plants and share produce with a neighbour" }
    ],
    resources: {
      videos: [
        { title: "Container Gardening for Beginners", url: "https://www.youtube.com/watch?v=example21", duration: "14 min", level: "beginner", source: "YouTube" },
        { title: "Growing Herbs in Small Spaces", url: "https://www.youtube.com/watch?v=example22", duration: "11 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "Best Plants for Container Gardening", url: "https://example.com/container-plants", duration: "5 min read", level: "beginner", source: "GardenBlog" },
        { title: "Watering Guide for Potted Plants", url: "https://example.com/watering-guide", duration: "4 min read", level: "beginner", source: "GardenBlog" }
      ],
      communities: [
        { title: "r/containergardening", url: "https://reddit.com/r/containergardening", members: "120k", platform: "Reddit" },
        { title: "GardenWeb Forum", url: "https://forums.gardenweb.com", members: "300k", platform: "Forum" }
      ]
    }
  },
  {
    id: "podcasting",
    name: "Podcasting",
    category: "Creative",
    tags: ["creative", "build-skill", "meet-people"],
    difficulty: "intermediate",
    timePerWeek: { min: 3, max: 8 },
    starterCost: { min: 0, max: 50 },
    environment: "indoor",
    social: "either",
    spaceNeeded: "room",
    timeToFirstWin: "1 week",
    description: "Share your voice and ideas with the world. Podcasting combines storytelling, interviewing, and audio production. Start with your phone and a quiet room — upgrade as you grow.",
    equipment: [
      { item: "USB microphone", required: false, cost: 40, alternative: "Phone earbuds with built-in mic" },
      { item: "Audio editing software (Audacity)", required: true, cost: 0, alternative: "GarageBand on Mac or Anchor app" },
      { item: "Quiet recording space", required: true, cost: 0, alternative: "Record in a closet full of clothes for sound dampening" },
      { item: "Hosting platform (Anchor/Spotify)", required: false, cost: 0, alternative: "Free tier on most platforms" }
    ],
    safetyNotes: [
      "Be mindful of what personal information you share publicly",
      "Get consent before recording conversations with others",
      "Protect your hearing — monitor audio at moderate levels"
    ],
    commonPitfalls: [
      { issue: "Waiting until everything is perfect to publish", fix: "Your first episodes will not be great — publish anyway and improve over time" },
      { issue: "Poor audio quality from room echo", fix: "Record in a small, carpeted room with soft furnishings to absorb sound" }
    ],
    weekOnePlan: [
      { day: 1, title: "Define your concept", description: "Choose a topic, format (solo/interview/story), and target episode length. Write a one-sentence show description.", estimatedTime: "30 min", coins: 30 },
      { day: 2, title: "Plan Episode 1", description: "Outline your first episode with an intro, 3 main points, and a closing. Keep it under 15 minutes.", estimatedTime: "30 min", coins: 30 },
      { day: 3, title: "Test your setup", description: "Record a 2-minute test clip. Listen back for audio quality, background noise, and clarity.", estimatedTime: "20 min", coins: 30 },
      { day: 4, title: "Record Episode 1", description: "Record your full first episode. Do not aim for perfection — aim for completion.", estimatedTime: "45 min", coins: 30 },
      { day: 5, title: "Learn basic editing", description: "Import your recording into Audacity. Learn to cut silences, remove mistakes, and normalise volume.", estimatedTime: "40 min", coins: 30 },
      { day: 6, title: "Add intro and outro", description: "Create or find royalty-free music for a short intro and outro. Add them to your episode.", estimatedTime: "30 min", coins: 30 },
      { day: 7, title: "Publish your episode", description: "Export your edited episode and upload to a free hosting platform. Share the link with one person.", estimatedTime: "30 min", coins: 30 }
    ],
    milestones: [
      { label: "Episode 1 published", timeframe: "Week 1", description: "Record, edit, and publish your first podcast episode" },
      { label: "4 episodes released", timeframe: "Month 1", description: "Publish one episode per week for a full month" },
      { label: "First listener feedback", timeframe: "3 months", description: "Receive a review, comment, or message from a listener" }
    ],
    resources: {
      videos: [
        { title: "Start a Podcast with Zero Budget", url: "https://www.youtube.com/watch?v=example23", duration: "16 min", level: "beginner", source: "YouTube" },
        { title: "Audacity Editing Tutorial", url: "https://www.youtube.com/watch?v=example24", duration: "20 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "Podcasting Equipment Guide", url: "https://example.com/podcast-gear", duration: "7 min read", level: "beginner", source: "PodBlog" },
        { title: "How to Structure a Podcast Episode", url: "https://example.com/podcast-structure", duration: "5 min read", level: "beginner", source: "PodBlog" }
      ],
      communities: [
        { title: "r/podcasting", url: "https://reddit.com/r/podcasting", members: "200k", platform: "Reddit" },
        { title: "Podcast Movement Community", url: "https://podcastmovement.com/community", members: "50k", platform: "Web" }
      ]
    }
  },
  {
    id: "yoga",
    name: "Yoga",
    category: "Wellbeing",
    tags: ["relax", "fit", "build-skill"],
    difficulty: "beginner",
    timePerWeek: { min: 2, max: 5 },
    starterCost: { min: 0, max: 20 },
    environment: "indoor",
    social: "either",
    spaceNeeded: "room",
    timeToFirstWin: "1 day",
    description: "Yoga builds flexibility, strength, and mental calm through guided movement and breathwork. Follow along with free videos at home — no studio membership needed to start.",
    equipment: [
      { item: "Yoga mat", required: false, cost: 15, alternative: "Towel on carpet or bare floor" },
      { item: "Comfortable stretchy clothing", required: true, cost: 0, alternative: "Any clothes you can move freely in" },
      { item: "Yoga blocks (pair)", required: false, cost: 10, alternative: "Stack of books or firm cushions" },
      { item: "Yoga strap", required: false, cost: 6, alternative: "Belt or towel" }
    ],
    safetyNotes: [
      "Never force a stretch — work to your edge, not past it",
      "Skip inversions if you have high blood pressure or neck issues",
      "Inform your instructor of any injuries before class"
    ],
    commonPitfalls: [
      { issue: "Comparing yourself to flexible people online", fix: "Yoga is about YOUR body — progress is personal and non-competitive" },
      { issue: "Holding your breath during poses", fix: "Breathe continuously — if you cannot breathe smoothly, ease off the pose" }
    ],
    weekOnePlan: [
      { day: 1, title: "Gentle introduction", description: "Follow a 15-minute beginner yoga video. Focus on breathing and basic poses like mountain and child's pose.", estimatedTime: "20 min", coins: 30 },
      { day: 2, title: "Sun salutations", description: "Learn the sun salutation sequence (Surya Namaskar A). Practice it 3 times slowly.", estimatedTime: "20 min", coins: 30 },
      { day: 3, title: "Standing poses", description: "Practice warrior I, warrior II, and triangle pose. Hold each for 5 breaths per side.", estimatedTime: "25 min", coins: 30 },
      { day: 4, title: "Rest day — breathing", description: "Practice 10 minutes of pranayama (breathing exercises). Try alternate nostril breathing.", estimatedTime: "10 min", coins: 30 },
      { day: 5, title: "Floor poses", description: "Practice seated forward fold, pigeon pose, and supine twist. Focus on releasing tension.", estimatedTime: "25 min", coins: 30 },
      { day: 6, title: "Balance poses", description: "Practice tree pose and eagle pose. Use a wall for support if needed.", estimatedTime: "20 min", coins: 30 },
      { day: 7, title: "Full flow class", description: "Follow a 30-minute beginner flow video combining everything you have learned this week.", estimatedTime: "35 min", coins: 30 }
    ],
    milestones: [
      { label: "First full practice", timeframe: "Week 1", description: "Complete a 30-minute yoga session from start to finish" },
      { label: "Touch your toes", timeframe: "Month 1", description: "Reach a forward fold that felt impossible on day 1" },
      { label: "Daily practice habit", timeframe: "3 months", description: "Practice yoga at least 5 days per week for a full month" }
    ],
    resources: {
      videos: [
        { title: "Yoga for Complete Beginners", url: "https://www.youtube.com/watch?v=example25", duration: "20 min", level: "beginner", source: "YouTube" },
        { title: "Morning Yoga Flow", url: "https://www.youtube.com/watch?v=example26", duration: "15 min", level: "beginner", source: "YouTube" }
      ],
      articles: [
        { title: "Yoga Poses for Beginners", url: "https://example.com/yoga-poses", duration: "6 min read", level: "beginner", source: "YogaBlog" },
        { title: "How to Build a Home Yoga Practice", url: "https://example.com/home-yoga", duration: "5 min read", level: "beginner", source: "YogaBlog" }
      ],
      communities: [
        { title: "r/yoga", url: "https://reddit.com/r/yoga", members: "500k", platform: "Reddit" },
        { title: "Yoga with Adriene Community", url: "https://yogawithadriene.com/community", members: "12M", platform: "YouTube" }
      ]
    }
  }
];


// ─── Achievements ────────────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  {
    id: "first-steps",
    name: "First Steps",
    icon: "👣",
    description: "Complete your first day of practice",
    daysThreshold: 1,
    streakThreshold: null,
    coinThreshold: null,
    savedThreshold: null,
    milestoneId: null,
    trigger: null
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    icon: "🔥",
    description: "Achieve a 7-day streak",
    daysThreshold: null,
    streakThreshold: 7,
    coinThreshold: null,
    savedThreshold: null,
    milestoneId: null,
    trigger: null
  },
  {
    id: "coin-collector",
    name: "Coin Collector",
    icon: "💰",
    description: "Earn 100 coins total",
    daysThreshold: null,
    streakThreshold: null,
    coinThreshold: 100,
    savedThreshold: null,
    milestoneId: null,
    trigger: null
  },
  {
    id: "hobby-explorer",
    name: "Hobby Explorer",
    icon: "🔍",
    description: "Save 3 hobbies to your list",
    daysThreshold: null,
    streakThreshold: null,
    coinThreshold: null,
    savedThreshold: 3,
    milestoneId: null,
    trigger: null
  },
  {
    id: "committed",
    name: "Committed",
    icon: "🎯",
    description: "Start your first hobby plan",
    daysThreshold: null,
    streakThreshold: null,
    coinThreshold: null,
    savedThreshold: null,
    milestoneId: null,
    trigger: "plan-started"
  },
  {
    id: "week-one-done",
    name: "Week One Done",
    icon: "🏆",
    description: "Complete all 7 days of your first week",
    daysThreshold: null,
    streakThreshold: null,
    coinThreshold: null,
    savedThreshold: null,
    milestoneId: "week-1-complete",
    trigger: null
  },
  {
    id: "fortnight-focus",
    name: "Fortnight Focus",
    icon: "⚡",
    description: "Maintain a 14-day streak",
    daysThreshold: null,
    streakThreshold: 14,
    coinThreshold: null,
    savedThreshold: null,
    milestoneId: null,
    trigger: null
  },
  {
    id: "treasure-chest",
    name: "Treasure Chest",
    icon: "🪙",
    description: "Earn 500 coins total",
    daysThreshold: null,
    streakThreshold: null,
    coinThreshold: 500,
    savedThreshold: null,
    milestoneId: null,
    trigger: null
  }
];

// ─── Rewards ─────────────────────────────────────────────────────────────────

const REWARDS = [
  {
    id: "custom-theme",
    name: "Custom Theme",
    description: "Unlock a custom colour theme for your dashboard",
    coinCost: 200,
    icon: "🎨"
  },
  {
    id: "bonus-resources",
    name: "Bonus Resources Pack",
    description: "Unlock 5 additional curated video tutorials for your hobby",
    coinCost: 500,
    icon: "📚"
  },
  {
    id: "achievement-frame",
    name: "Gold Achievement Frame",
    description: "Add a gold animated frame to your profile achievements",
    coinCost: 1000,
    icon: "✨"
  }
];
