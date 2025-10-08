// Compatibility Test Questions
// Based on relationship psychology research and compatibility assessment frameworks

const compatibilityQuestions = [
    {
        id: 1,
        category: "Values & Priorities",
        question: "What matters most to you in life right now?",
        options: [
            { id: "a", text: "Career success and professional growth", value: "career" },
            { id: "b", text: "Close relationships and quality time with loved ones", value: "relationships" },
            { id: "c", text: "Personal freedom and new experiences", value: "freedom" },
            { id: "d", text: "Financial security and stability", value: "security" }
        ]
    },
    {
        id: 2,
        category: "Communication Style",
        question: "When you have a disagreement, how do you prefer to handle it?",
        options: [
            { id: "a", text: "Address it immediately and talk it through", value: "direct" },
            { id: "b", text: "Take some time to cool off, then discuss calmly", value: "reflective" },
            { id: "c", text: "Try to find a compromise quickly", value: "compromising" },
            { id: "d", text: "Avoid confrontation and hope it resolves naturally", value: "avoidant" }
        ]
    },
    {
        id: 3,
        category: "Social Preferences",
        question: "How do you prefer to spend a free weekend?",
        options: [
            { id: "a", text: "Quiet time at home, recharging alone or with close people", value: "introverted" },
            { id: "b", text: "Social gatherings with friends or meeting new people", value: "extroverted" },
            { id: "c", text: "Outdoor adventures or trying something new", value: "adventurous" },
            { id: "d", text: "A mix - some social time, some alone time", value: "balanced" }
        ]
    },
    {
        id: 4,
        category: "Future Vision",
        question: "Where do you see yourself in 5 years?",
        options: [
            { id: "a", text: "Settled in one place with strong community roots", value: "settled" },
            { id: "b", text: "Exploring different cities or countries", value: "nomadic" },
            { id: "c", text: "Focused on building a family", value: "family-focused" },
            { id: "d", text: "Advancing in my career or passion projects", value: "career-focused" }
        ]
    },
    {
        id: 5,
        category: "Emotional Expression",
        question: "How comfortable are you sharing your feelings?",
        options: [
            { id: "a", text: "Very comfortable - I express emotions openly", value: "expressive" },
            { id: "b", text: "Somewhat comfortable - I share when I feel safe", value: "selective" },
            { id: "c", text: "Reserved - I prefer to process internally first", value: "reserved" },
            { id: "d", text: "It depends on the situation and person", value: "contextual" }
        ]
    },
    {
        id: 6,
        category: "Problem-Solving",
        question: "When facing a major life decision, what guides you most?",
        options: [
            { id: "a", text: "Logic, facts, and practical considerations", value: "analytical" },
            { id: "b", text: "My gut feeling and intuition", value: "intuitive" },
            { id: "c", text: "Advice from trusted friends or family", value: "collaborative" },
            { id: "d", text: "My values and what feels right morally", value: "values-driven" }
        ]
    },
    {
        id: 7,
        category: "Lifestyle & Habits",
        question: "What's your ideal daily routine?",
        options: [
            { id: "a", text: "Structured schedule with clear routines", value: "structured" },
            { id: "b", text: "Flexible and spontaneous - go with the flow", value: "spontaneous" },
            { id: "c", text: "Balanced mix of planned and unplanned", value: "balanced" },
            { id: "d", text: "Depends on my mood and energy level", value: "adaptive" }
        ]
    },
    {
        id: 8,
        category: "Conflict Resolution",
        question: "After an argument, what helps you feel better?",
        options: [
            { id: "a", text: "A sincere apology and acknowledgment", value: "validation" },
            { id: "b", text: "Quality time together and physical affection", value: "reconnection" },
            { id: "c", text: "A concrete plan to prevent it from happening again", value: "solution-focused" },
            { id: "d", text: "Space and time to process, then reconnect", value: "space" }
        ]
    },
    {
        id: 9,
        category: "Personal Growth",
        question: "How important is personal development and self-improvement to you?",
        options: [
            { id: "a", text: "Extremely - I'm always working on myself", value: "high-growth" },
            { id: "b", text: "Important, but I balance it with acceptance", value: "balanced-growth" },
            { id: "c", text: "Somewhat - I focus on it when needed", value: "moderate-growth" },
            { id: "d", text: "I'm content with who I am now", value: "acceptance" }
        ]
    },
    {
        id: 10,
        category: "Love Languages",
        question: "How do you most naturally show care and appreciation?",
        options: [
            { id: "a", text: "Through words - compliments and verbal affirmation", value: "words" },
            { id: "b", text: "Through actions - helping and doing things for them", value: "acts" },
            { id: "c", text: "Through quality time and full attention", value: "time" },
            { id: "d", text: "Through physical touch and affection", value: "touch" }
        ]
    }
];

// Compatibility scoring logic
const compatibilityScoring = {
    // Categories that score higher when answers match
    matchCategories: [
        "Values & Priorities",
        "Future Vision",
        "Lifestyle & Habits",
        "Personal Growth"
    ],

    // Categories where complementary answers can also score well
    complementaryCategories: {
        "Communication Style": {
            compatible: [
                ["direct", "reflective"],
                ["compromising", "reflective"],
                ["direct", "compromising"]
            ]
        },
        "Social Preferences": {
            compatible: [
                ["balanced", "introverted"],
                ["balanced", "extroverted"],
                ["adventurous", "extroverted"]
            ]
        },
        "Problem-Solving": {
            compatible: [
                ["analytical", "values-driven"],
                ["intuitive", "collaborative"],
                ["analytical", "collaborative"]
            ]
        },
        "Emotional Expression": {
            compatible: [
                ["expressive", "selective"],
                ["selective", "contextual"],
                ["expressive", "contextual"]
            ]
        }
    },

    // Insights based on score ranges
    insights: {
        90: {
            rating: "Exceptional Compatibility",
            message: "You share remarkable alignment in values, communication, and life vision. This strong foundation supports deep connection.",
            strengths: "Strong value alignment, compatible communication styles, and shared vision for the future",
            growth: "Continue nurturing your connection through honest communication and shared experiences"
        },
        80: {
            rating: "Great Match",
            message: "You have strong compatibility across key areas. Your differences can complement each other beautifully.",
            strengths: "Aligned core values and compatible approach to life's important decisions",
            growth: "Embrace your differences as opportunities for growth and learning from each other"
        },
        70: {
            rating: "Good Compatibility",
            message: "You share meaningful common ground while bringing unique perspectives to the relationship.",
            strengths: "Healthy balance of similarities and differences that can enrich your connection",
            growth: "Focus on understanding each other's different approaches and finding creative compromises"
        },
        60: {
            rating: "Moderate Compatibility",
            message: "You have some important alignments but also notable differences to navigate together.",
            strengths: "Your differences can be opportunities for personal growth and expanded perspectives",
            growth: "Invest in understanding each other's values and communication needs. Build bridges through shared interests"
        },
        50: {
            rating: "Developing Compatibility",
            message: "You bring different approaches and perspectives to your relationship.",
            strengths: "Diversity of thought and approach can lead to creative problem-solving",
            growth: "Focus on building understanding, practicing patience, and finding your unique rhythm together"
        },
        0: {
            rating: "Significant Differences",
            message: "You have notably different approaches to life, values, and communication.",
            strengths: "Opportunity to learn from completely different perspectives and worldviews",
            growth: "Success will require extra effort in communication, compromise, and mutual respect for differences"
        }
    }
};

// Helper function to calculate compatibility score
function calculateCompatibilityScore(player1Answers, player2Answers) {
    if (!player1Answers || !player2Answers || player1Answers.length !== player2Answers.length) {
        console.error('Invalid answers for compatibility calculation');
        return { score: 0, breakdown: [], insights: {} };
    }

    let totalPoints = 0;
    let maxPoints = player1Answers.length * 10;
    const breakdown = [];

    compatibilityQuestions.forEach((question, index) => {
        const answer1 = player1Answers[index];
        const answer2 = player2Answers[index];
        const category = question.category;

        let points = 0;
        let match = false;

        // Check for exact match
        if (answer1 === answer2) {
            points = 10;
            match = true;
        }
        // Check for complementary compatibility
        else if (compatibilityScoring.complementaryCategories[category]) {
            const compatible = compatibilityScoring.complementaryCategories[category].compatible;
            const isCompatible = compatible.some(pair =>
                (pair[0] === answer1 && pair[1] === answer2) ||
                (pair[1] === answer1 && pair[0] === answer2)
            );
            if (isCompatible) {
                points = 7;
                match = true;
            }
        }

        totalPoints += points;
        breakdown.push({
            category,
            points,
            maxPoints: 10,
            match,
            player1Answer: answer1,
            player2Answer: answer2
        });
    });

    const scorePercentage = Math.round((totalPoints / maxPoints) * 100);

    // Get appropriate insights
    let insights = compatibilityScoring.insights[0];
    for (const threshold of [90, 80, 70, 60, 50]) {
        if (scorePercentage >= threshold) {
            insights = compatibilityScoring.insights[threshold];
            break;
        }
    }

    return {
        score: scorePercentage,
        totalPoints,
        maxPoints,
        breakdown,
        insights
    };
}
