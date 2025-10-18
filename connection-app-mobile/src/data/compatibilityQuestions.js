// Compatibility Test Questions - RANKING SYSTEM
export const compatibilityQuestions = [
    {
        id: 1,
        category: "Values & Priorities",
        question: "Rank these life priorities from most important (1) to least important (4):",
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
        question: "Rank how you prefer to handle disagreements (1=most preferred, 4=least preferred):",
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
        question: "Rank your ideal weekend activities (1=most appealing, 4=least appealing):",
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
        question: "Rank where you see yourself in 5 years (1=most likely, 4=least likely):",
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
        question: "Rank your comfort level sharing feelings (1=most comfortable, 4=least comfortable):",
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
        question: "Rank what guides your major life decisions (1=most influential, 4=least influential):",
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
        question: "Rank your ideal daily routine preferences (1=most ideal, 4=least ideal):",
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
        question: "Rank what helps you most after an argument (1=most helpful, 4=least helpful):",
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
        question: "Rank your approach to personal development (1=most like you, 4=least like you):",
        options: [
            { id: "a", text: "Extremely important - I'm always working on myself", value: "high-growth" },
            { id: "b", text: "Important, but I balance it with acceptance", value: "balanced-growth" },
            { id: "c", text: "Somewhat important - I focus on it when needed", value: "moderate-growth" },
            { id: "d", text: "I'm content with who I am now", value: "acceptance" }
        ]
    },
    {
        id: 10,
        category: "Love Languages",
        question: "Rank how you naturally show care and appreciation (1=most natural, 4=least natural):",
        options: [
            { id: "a", text: "Through words - compliments and verbal affirmation", value: "words" },
            { id: "b", text: "Through actions - helping and doing things for them", value: "acts" },
            { id: "c", text: "Through quality time and full attention", value: "time" },
            { id: "d", text: "Through physical touch and affection", value: "touch" }
        ]
    }
];

export function calculateCompatibilityScore(player1Rankings, player2Rankings) {
    if (!player1Rankings || !player2Rankings || player1Rankings.length !== player2Rankings.length) {
        console.error('Invalid rankings for compatibility calculation');
        return { score: 0, breakdown: [], insights: {} };
    }

    let totalPoints = 0;
    let maxPoints = 0;
    const breakdown = [];

    compatibilityQuestions.forEach((question, index) => {
        const ranking1 = player1Rankings[index];
        const ranking2 = player2Rankings[index];
        const category = question.category;

        let questionPoints = 0;
        let questionMaxPoints = 0;

        question.options.forEach(option => {
            const optionId = option.id;
            const rank1 = ranking1[optionId];
            const rank2 = ranking2[optionId];

            const difference = Math.abs(rank1 - rank2);
            const points = 3 - difference;

            questionPoints += points;
            questionMaxPoints += 3;
        });

        totalPoints += questionPoints;
        maxPoints += questionMaxPoints;

        const matchPercentage = Math.round((questionPoints / questionMaxPoints) * 100);

        breakdown.push({
            category,
            points: questionPoints,
            maxPoints: questionMaxPoints,
            matchPercentage,
            player1Ranking: ranking1,
            player2Ranking: ranking2
        });
    });

    const scorePercentage = Math.round((totalPoints / maxPoints) * 100);

    const insights = getInsights(scorePercentage);

    return {
        score: scorePercentage,
        totalPoints,
        maxPoints,
        breakdown,
        insights
    };
}

function getInsights(score) {
    const insightsMap = {
        90: {
            rating: "Exceptional Compatibility",
            message: "Your priorities and values align remarkably well. You rank things in very similar ways, suggesting deep compatibility.",
            strengths: "Nearly identical value systems, compatible communication styles, and aligned life priorities",
            growth: "Continue nurturing your connection through honest communication and shared experiences"
        },
        80: {
            rating: "Great Match",
            message: "You have strong alignment in how you prioritize important aspects of life. Your differences are complementary.",
            strengths: "Very similar core values with some healthy diversity in preferences",
            growth: "Embrace your differences as opportunities for growth and learning from each other"
        },
        70: {
            rating: "Good Compatibility",
            message: "You share meaningful common ground in your priorities while bringing unique perspectives.",
            strengths: "Healthy balance of similarities and differences that can enrich your connection",
            growth: "Focus on understanding each other's different priorities and finding creative compromises"
        },
        60: {
            rating: "Moderate Compatibility",
            message: "You have some alignment in priorities but also notable differences to navigate together.",
            strengths: "Your differences can be opportunities for personal growth and expanded perspectives",
            growth: "Invest in understanding why each of you prioritizes things differently. Build bridges through shared interests"
        },
        50: {
            rating: "Developing Compatibility",
            message: "You bring different priority systems and approaches to your relationship.",
            strengths: "Diversity of thought and approach can lead to creative problem-solving",
            growth: "Focus on building understanding, practicing patience, and finding your unique rhythm together"
        },
        0: {
            rating: "Significant Differences",
            message: "You have notably different ways of prioritizing life's important aspects.",
            strengths: "Opportunity to learn from completely different perspectives and worldviews",
            growth: "Success will require extra effort in communication, compromise, and mutual respect for differences"
        }
    };

    for (const threshold of [90, 80, 70, 60, 50]) {
        if (score >= threshold) {
            return insightsMap[threshold];
        }
    }
    return insightsMap[0];
}
