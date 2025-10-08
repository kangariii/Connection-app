// Knowledge Quiz Questions
// Questions designed to test how well players know each other

const knowledgeQuestions = [
    {
        id: 1,
        question: "What's my biggest pet peeve?",
        options: [
            "People being late",
            "Loud chewing or eating sounds",
            "Interrupting while I'm talking",
            "Leaving things messy or disorganized"
        ]
    },
    {
        id: 2,
        question: "If I could have any superpower, what would I choose?",
        options: [
            "Flying",
            "Reading minds",
            "Time travel",
            "Invisibility"
        ]
    },
    {
        id: 3,
        question: "What's my go-to comfort food?",
        options: [
            "Pizza",
            "Ice cream",
            "Mac and cheese",
            "Chocolate"
        ]
    },
    {
        id: 4,
        question: "How do I handle stress?",
        options: [
            "Exercise or physical activity",
            "Talk to friends or family",
            "Watch TV or movies",
            "Need alone time to recharge"
        ]
    },
    {
        id: 5,
        question: "What's my ideal vacation?",
        options: [
            "Beach resort - relaxation and sun",
            "Mountain adventure - hiking and nature",
            "City exploration - culture and food",
            "Staycation - relaxing at home"
        ]
    },
    {
        id: 6,
        question: "What's my biggest fear?",
        options: [
            "Heights",
            "Public speaking",
            "Failure or letting people down",
            "Being alone or isolated"
        ]
    },
    {
        id: 7,
        question: "If I won the lottery, what would I do first?",
        options: [
            "Quit my job immediately",
            "Share with family and friends",
            "Invest and save most of it",
            "Go on an amazing trip"
        ]
    },
    {
        id: 8,
        question: "What's my favorite way to spend a rainy day?",
        options: [
            "Reading a good book",
            "Watching movies or binge a series",
            "Cooking or baking",
            "Playing games or puzzles"
        ]
    },
    {
        id: 9,
        question: "How do I prefer to celebrate my birthday?",
        options: [
            "Big party with lots of friends",
            "Quiet dinner with close people",
            "Adventure or special experience",
            "Low-key - treat it like any other day"
        ]
    },
    {
        id: 10,
        question: "What motivates me most in life?",
        options: [
            "Making a positive impact on others",
            "Personal achievement and success",
            "Building meaningful relationships",
            "Freedom and independence"
        ]
    },
    {
        id: 11,
        question: "What's my hidden talent or skill?",
        options: [
            "Musical ability (singing/instrument)",
            "Artistic or creative talent",
            "Athletic or physical skill",
            "Tech or problem-solving ability"
        ]
    },
    {
        id: 12,
        question: "How would I spend a perfect Saturday morning?",
        options: [
            "Sleeping in as late as possible",
            "Early morning workout or run",
            "Breakfast out with friends/family",
            "Catching up on hobbies or projects"
        ]
    },
    {
        id: 13,
        question: "What's my relationship with social media?",
        options: [
            "Very active - posting and engaging often",
            "Passive observer - scroll but rarely post",
            "Minimal use - check occasionally",
            "Avoid it - not my thing"
        ]
    },
    {
        id: 14,
        question: "What would be my dream job?",
        options: [
            "Creative field (artist, writer, designer)",
            "Helping profession (teacher, doctor, counselor)",
            "Entrepreneur or business owner",
            "Something adventurous (travel, outdoors)"
        ]
    },
    {
        id: 15,
        question: "How do I make important decisions?",
        options: [
            "Pros and cons list - very analytical",
            "Sleep on it and trust my gut",
            "Talk it through with trusted people",
            "Research extensively first"
        ]
    },
    {
        id: 16,
        question: "What's my favorite season?",
        options: [
            "Spring - new beginnings",
            "Summer - warmth and sunshine",
            "Fall - cozy and colorful",
            "Winter - holidays and snow"
        ]
    },
    {
        id: 17,
        question: "How organized am I?",
        options: [
            "Very organized - everything has a place",
            "Moderately organized - organized chaos",
            "Prefer spontaneity over organization",
            "Messy but know where everything is"
        ]
    },
    {
        id: 18,
        question: "What's my morning mood typically like?",
        options: [
            "Morning person - energetic and cheerful",
            "Slow starter - need coffee and quiet time",
            "Grumpy until fully awake",
            "Depends on how I slept"
        ]
    },
    {
        id: 19,
        question: "If I could meet anyone (dead or alive), who would it be?",
        options: [
            "Historical figure or leader",
            "Celebrity or entertainer",
            "Family member I never met",
            "Scientist or inventor"
        ]
    },
    {
        id: 20,
        question: "What's my approach to conflict?",
        options: [
            "Face it head-on immediately",
            "Avoid it if possible",
            "Need time to process first",
            "Try to find quick compromise"
        ]
    },
    {
        id: 21,
        question: "What's my love language?",
        options: [
            "Words of affirmation",
            "Quality time together",
            "Acts of service",
            "Physical touch"
        ]
    },
    {
        id: 22,
        question: "How adventurous am I with food?",
        options: [
            "Very - will try anything once",
            "Somewhat - within reason",
            "Stick to what I know and like",
            "Very picky eater"
        ]
    },
    {
        id: 23,
        question: "What's my ideal pet?",
        options: [
            "Dog - loyal companion",
            "Cat - independent friend",
            "Something unique (bird, reptile, etc.)",
            "No pets - prefer freedom"
        ]
    },
    {
        id: 24,
        question: "How do I handle compliments?",
        options: [
            "Accept graciously and say thank you",
            "Feel awkward and deflect",
            "Return a compliment back",
            "Downplay or disagree"
        ]
    },
    {
        id: 25,
        question: "What's my typical bedtime?",
        options: [
            "Early bird - before 10pm",
            "Moderate - around 11pm",
            "Night owl - midnight or later",
            "Inconsistent - varies wildly"
        ]
    },
    {
        id: 26,
        question: "How competitive am I?",
        options: [
            "Very competitive - love to win",
            "Moderately - enjoy competition",
            "Not very - it's just for fun",
            "Avoid competition entirely"
        ]
    },
    {
        id: 27,
        question: "What's my coffee/tea preference?",
        options: [
            "Coffee - need my caffeine",
            "Tea - prefer variety of flavors",
            "Both - depends on mood",
            "Neither - not a hot beverage person"
        ]
    },
    {
        id: 28,
        question: "How do I typically spend money?",
        options: [
            "Saver - very careful and frugal",
            "Balanced - save and spend wisely",
            "Spender - enjoy treating myself",
            "Impulsive - buy what I want"
        ]
    },
    {
        id: 29,
        question: "What's my relationship with exercise?",
        options: [
            "Love it - regular workout routine",
            "Enjoy it - exercise a few times a week",
            "Do it because I should",
            "Avoid it - not my thing"
        ]
    },
    {
        id: 30,
        question: "How nostalgic am I?",
        options: [
            "Very - love reminiscing about the past",
            "Somewhat - enjoy good memories",
            "Present-focused - don't dwell on past",
            "Future-focused - always looking ahead"
        ]
    }
];

// Helper function to get random questions
function getRandomKnowledgeQuestions(count = 15) {
    const shuffled = [...knowledgeQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Helper function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
