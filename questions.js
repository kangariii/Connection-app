// Questions Database for Who Are You? App
// Questions are organized by Round -> Category -> Relationship Type

const questionsDatabase = {
    // ROUND 1 - Getting Started (Light/Surface Level)
    1: {
        "Favorites": {
            // Universal questions that work for most relationships
            universal: [
                "What's your favorite way to spend a weekend?",
                "What's your favorite type of weather and why?",
                "What's your favorite childhood snack that you still enjoy?",
                "What's your favorite thing about the place where you live?",
                "What's your favorite way to treat yourself after a hard day?"
            ],
            // Family-specific questions
            family: [
                "What's your favorite family tradition we have?",
                "What's your favorite memory from a family vacation?",
                "What's your favorite thing we used to do together when I was younger?",
                "What's your favorite family recipe or meal?",
                "What's your favorite story about our family that you love to tell?"
            ],
            // Romantic relationship questions
            romantic: [
                "What's your favorite thing about the early days of our relationship?",
                "What's your favorite way we spend time together?",
                "What's your favorite surprise I've ever given you?",
                "What's your favorite date we've been on?",
                "What's your favorite thing about coming home to each other?"
            ],
            // Friend questions
            friends: [
                "What's your favorite memory we've made together?",
                "What's your favorite thing about our friendship?",
                "What's your favorite activity we do together?",
                "What's your favorite inside joke we have?",
                "What's your favorite thing I've introduced you to?"
            ]
        },
        "Daily Life": {
            universal: [
                "What does your ideal morning routine look like?",
                "What's the first thing you usually do when you get home?",
                "How do you like to unwind at the end of the day?",
                "What's a small daily habit that makes you happy?",
                "What's your go-to comfort activity when you're feeling stressed?"
            ],
            family: [
                "What's something about your daily routine that might surprise me?",
                "How has your typical day changed the most in recent years?",
                "What's a daily habit you picked up from our family?",
                "What part of your day do you look forward to most?",
                "What's something you do daily that reminds you of home?"
            ],
            romantic: [
                "What's a small thing I do daily that you really appreciate?",
                "How do you prefer to start our mornings together?",
                "What's your favorite way we've learned to sync our daily routines?",
                "What daily habit of mine makes you smile?",
                "How do you like to reconnect with each other after being apart all day?"
            ],
            friends: [
                "What's something new in your daily routine lately?",
                "How do you usually decide what to do with your free time?",
                "What's a daily habit you're proud of?",
                "What part of your week do you look forward to most?",
                "What's something you do regularly that helps you feel like yourself?"
            ]
        },
        "Fun Facts": {
            universal: [
                "What's a skill you'd love to master if time wasn't a factor?",
                "What's something most people don't know about you?",
                "What's the most interesting thing you've learned recently?",
                "What's a weird food combination you actually enjoy?",
                "What's a random fact about yourself that usually surprises people?"
            ],
            family: [
                "What's a talent you have that the family doesn't see very often?",
                "What's something you were obsessed with as a kid that might surprise me now?",
                "What's a family trait you see in yourself?",
                "What's something you've always wondered about our family history?",
                "What's a skill you learned that you wish you could teach everyone in the family?"
            ],
            romantic: [
                "What's something about you that you're still discovering yourself?",
                "What's a hidden talent you haven't shown me yet?",
                "What's something from your past that shaped who you are today?",
                "What's a quirky habit you have that you think is endearing?",
                "What's something you hope we'll discover together in the future?"
            ],
            friends: [
                "What's a hobby or interest you've been wanting to explore?",
                "What's something about your personality that has changed over the years?",
                "What's a random skill you're surprisingly good at?",
                "What's something you were passionate about as a kid?",
                "What's a fact about yourself that would make for good trivia?"
            ]
        }
    },

    // ROUND 2 - Personal Preferences (Getting More Personal)
    2: {
        "Choices": {
            universal: [
                "Would you rather have the ability to read minds or see the future?",
                "Would you rather live in a big city or a small town?",
                "Would you rather be famous for something good or remain unknown but happy?",
                "Would you rather have unlimited time or unlimited money?",
                "Would you rather always know when someone is lying or always get away with lying?"
            ],
            family: [
                "Would you rather have grown up in a different time period or different place?",
                "Would you rather know everything about our family's past or future?",
                "Would you rather have the family be closer geographically or emotionally?",
                "Would you rather have more family traditions or more spontaneous family time?",
                "Would you rather have the family all have the same interests or completely different ones?"
            ],
            romantic: [
                "Would you rather travel the world together or build a beautiful home together?",
                "Would you rather know everything about each other's past or discover it gradually?",
                "Would you rather have more date nights out or cozy nights in?",
                "Would you rather be able to read each other's minds or always be surprised by each other?",
                "Would you rather grow old in the place we met or somewhere completely new?"
            ],
            friends: [
                "Would you rather have a few very close friends or many casual friends?",
                "Would you rather have friends who are very similar to you or very different?",
                "Would you rather be the friend who gives advice or receives it?",
                "Would you rather have friendships that are always fun or always deep?",
                "Would you rather have friends who challenge you or comfort you?"
            ]
        },
        "Experiences": {
            universal: [
                "What's an experience you had that completely changed your perspective?",
                "What's something you've done that you never thought you'd be able to do?",
                "What's the most spontaneous thing you've ever done?",
                "What's an experience you're glad you said yes to, even though you were scared?",
                "What's something you've experienced that you wish everyone could experience?"
            ],
            family: [
                "What's a family experience that you think shaped who you are today?",
                "What's an experience we shared that you remember differently than you think I do?",
                "What's something you experienced growing up that you want to recreate or avoid in your own life?",
                "What's a challenging experience our family went through that ultimately brought us closer?",
                "What's an experience you had away from family that made you appreciate home more?"
            ],
            romantic: [
                "What's an experience from before we met that you think prepared you for our relationship?",
                "What's an experience we've shared that you think defines our relationship?",
                "What's something you experienced in past relationships that you appreciate differently now?",
                "What's an experience you want us to have together in the next year?",
                "What's an experience that made you realize you loved me?"
            ],
            friends: [
                "What's an experience that taught you what you value in friendship?",
                "What's something you've experienced that you wish you could share with friends?",
                "What's an experience that made you realize who your true friends are?",
                "What's an adventure you'd love to go on with friends?",
                "What's an experience you had that you think would surprise your friends?"
            ]
        },
        "Personality": {
            universal: [
                "How do you typically handle conflict or disagreement?",
                "What's something about your personality that has changed as you've gotten older?",
                "How do you usually make important decisions?",
                "What's a personality trait you're working on developing?",
                "How do you typically respond when you're feeling overwhelmed?"
            ],
            family: [
                "What personality trait do you think you got from our family?",
                "How do you think your personality fits within our family dynamic?",
                "What's a personality trait you have that's different from the rest of the family?",
                "How do you think your personality has been shaped by being part of our family?",
                "What's a personality trait you hope to pass on to future generations?"
            ],
            romantic: [
                "What personality trait of yours do you think complements mine well?",
                "How has being in our relationship changed your personality?",
                "What's a personality trait of yours that you hope I find endearing?",
                "How do our different personality traits help us as a couple?",
                "What's a personality trait you have that you think helps our relationship?"
            ],
            friends: [
                "What personality trait do you think draws people to be friends with you?",
                "How does your personality show up differently with different friends?",
                "What's a personality trait you admire in your friends?",
                "How do you think your personality has evolved through friendships?",
                "What's a personality trait that has gotten you into trouble in friendships?"
            ]
        }
    },

    // ROUND 3 - Values & Perspectives (Getting Deeper)
    3: {
        "Beliefs": {
            universal: [
                "What's a belief you hold that you think would surprise people?",
                "What's something you used to believe strongly that you've changed your mind about?",
                "What do you believe is the most important quality in a person?",
                "What's a belief you have about life that guides your daily decisions?",
                "What do you believe happens when we die?"
            ],
            family: [
                "What family belief or value do you think has shaped you the most?",
                "What's a belief you have about family that might be different from others in our family?",
                "What do you believe is the most important thing our family has taught you?",
                "What family tradition or belief do you want to continue or change?",
                "What do you believe makes our family unique?"
            ],
            romantic: [
                "What do you believe is the most important element of a lasting relationship?",
                "What's a belief about love that you've developed through our relationship?",
                "What do you believe we do well as a couple that other couples struggle with?",
                "What's a belief about relationships that you held before us that has changed?",
                "What do you believe is our relationship's greatest strength?"
            ],
            friends: [
                "What do you believe makes a friendship last?",
                "What's a belief about friendship that you've developed over the years?",
                "What do you believe is the most important thing friends can do for each other?",
                "What's a belief about loyalty in friendship?",
                "What do you believe friendship adds to life that nothing else can?"
            ]
        },
        "Relationships": {
            universal: [
                "What's the most important lesson you've learned about relationships?",
                "How do you know when you truly trust someone?",
                "What do you think makes some relationships last while others don't?",
                "What's something you need in relationships that you didn't realize until recently?",
                "How do you typically show someone that you care about them?"
            ],
            family: [
                "What's something about family relationships that you understand now that you didn't as a child?",
                "How do you think our family relationship has evolved over the years?",
                "What's something you appreciate about our family relationship now that you took for granted before?",
                "What do you think is the biggest challenge in family relationships?",
                "How do you want our family relationship to continue growing?"
            ],
            romantic: [
                "What's the most important thing you've learned about love from our relationship?",
                "How do you know when you feel most connected to me?",
                "What's something about romantic relationships that you understand now that you didn't before us?",
                "What do you think we do differently than other couples?",
                "How do you want our relationship to grow in the coming years?"
            ],
            friends: [
                "What's the most important thing you've learned about friendship?",
                "How do you maintain friendships when life gets busy?",
                "What's something you need from friendships at this stage of your life?",
                "How do you know when a friendship is really strong?",
                "What's the best advice you'd give someone about making good friends?"
            ]
        },
        "Growth": {
            universal: [
                "What's an area of your life where you've grown the most?",
                "What's something you're still learning about yourself?",
                "What's a challenge you're facing that's helping you grow?",
                "What's something you want to improve about yourself this year?",
                "How do you typically push yourself out of your comfort zone?"
            ],
            family: [
                "How do you think being part of our family has helped you grow?",
                "What's something you've learned about yourself through family challenges?",
                "How has your perspective on family changed as you've grown older?",
                "What's a way you want to grow that you think our family could support?",
                "What's something about yourself that you discovered through family relationships?"
            ],
            romantic: [
                "How has our relationship helped you grow as a person?",
                "What's something about yourself that you've discovered through loving me?",
                "What's a way you want to grow that you think I could support?",
                "How do you think we've both grown since we've been together?",
                "What's something challenging about our relationship that has ultimately helped you grow?"
            ],
            friends: [
                "How have your friendships helped you grow as a person?",
                "What's something about yourself that you've learned through friendship challenges?",
                "What's a way your friends have pushed you to grow?",
                "How do you want to grow as a friend?",
                "What's something you've discovered about yourself through helping friends?"
            ]
        }
    },

    // ROUND 4 - Deeper Connections (More Meaningful)
    4: {
        "Memories": {
            universal: [
                "What's a memory that always makes you smile when you think about it?",
                "What's a childhood memory that feels as vivid as if it happened yesterday?",
                "What's a memory that changed how you see the world?",
                "What's your earliest memory that feels significant to you?",
                "What's a memory you hope you never forget?"
            ],
            family: [
                "What's your favorite memory of just the two of us?",
                "What's a memory from childhood that you think shaped your relationship with family?",
                "What's a family memory that you think about when you need comfort?",
                "What's a memory of our family that you hope to recreate someday?",
                "What's your funniest memory involving our family?"
            ],
            romantic: [
                "What's your favorite memory from the early days of our relationship?",
                "What's a memory of us that you replay when you miss me?",
                "What's a memory that made you realize how much you loved me?",
                "What's a small, everyday memory of us that you treasure?",
                "What's a memory of us overcoming something difficult together?"
            ],
            friends: [
                "What's your favorite memory of us being completely ridiculous together?",
                "What's a memory of our friendship that you treasure most?",
                "What's a memory that made you realize how much our friendship meant to you?",
                "What's your funniest memory involving our friend group?",
                "What's a memory of me being there for you when you needed it?"
            ]
        },
        "Emotions": {
            universal: [
                "What emotion do you have trouble expressing or dealing with?",
                "What's something that always makes you feel hopeful?",
                "When do you feel most like yourself?",
                "What's something that makes you feel deeply grateful?",
                "What emotion do you think you experience more intensely than most people?"
            ],
            family: [
                "What's an emotion you associate with our family?",
                "When do you feel most proud to be part of our family?",
                "What's something about our family that always makes you feel loved?",
                "What emotion do you think our family helped you learn to express?",
                "When do you feel most connected to our family heritage or history?"
            ],
            romantic: [
                "What emotion do you feel most when you think about our future together?",
                "When do you feel most loved by me?",
                "What's an emotion you've learned to express better because of our relationship?",
                "What emotion do you feel when you imagine growing old together?",
                "When do you feel most grateful for our relationship?"
            ],
            friends: [
                "What emotion do you most associate with our friendship?",
                "When do you feel most supported by your friends?",
                "What's an emotion that friendship has helped you process?",
                "When do you feel most like your true self around friends?",
                "What emotion do you feel when you think about the role friendship plays in your life?"
            ]
        },
        "Dreams": {
            universal: [
                "What's a dream you've never told anyone about?",
                "What's something you hope to accomplish in the next five years?",
                "What's a place you dream of visiting and why?",
                "What's something you'd regret not trying if you could live your life again?",
                "What's a dream that scares you but also excites you?"
            ],
            family: [
                "What's a dream you have for our family's future?",
                "What's something you hope future generations of our family will know about us?",
                "What's a family tradition you dream of starting?",
                "What's something you hope to give to or share with our family?",
                "What's a dream you have that you think our family would support?"
            ],
            romantic: [
                "What's a dream you have for us as a couple?",
                "What's something you hope we'll experience together in our lifetime?",
                "What's a dream you have that you think we could achieve together?",
                "What's something you hope people say about our relationship?",
                "What's a dream you have for how we'll love each other in old age?"
            ],
            friends: [
                "What's a dream adventure you'd love to go on with friends?",
                "What's something you hope your friendships will look like in 10 years?",
                "What's a dream you have that you think friends could help you achieve?",
                "What's something you hope to give to your friends over the years?",
                "What's a dream you have about the impact your friendships will have on your life?"
            ]
        }
    },

    // ROUND 5 - Most Vulnerable (Deepest Level)
    5: {
        "Reflections": {
            universal: [
                "What's the most important lesson life has taught you so far?",
                "What's something you wish you could tell your younger self?",
                "What's a mistake you made that ultimately led to something good?",
                "What's something you've learned about yourself that surprised you?",
                "If you could change one decision you've made, would you? Why or why not?"
            ],
            family: [
                "What's the most important thing our family has taught you about life?",
                "What's something you understand about our family now that you didn't understand growing up?",
                "What's a family challenge that ultimately made you stronger?",
                "What's something you hope future generations learn from our family's story?",
                "What's the most valuable thing you've gained from being part of our family?"
            ],
            romantic: [
                "What's the most important thing you've learned about love from our relationship?",
                "What's something about yourself that you've discovered through loving me?",
                "What's the most meaningful way our relationship has changed you?",
                "What's something difficult we've been through that ultimately strengthened us?",
                "What's the most beautiful thing about the love we share?"
            ],
            friends: [
                "What's the most important thing friendship has taught you about life?",
                "What's something you've learned about yourself through your friendships?",
                "What's a friendship challenge that taught you something valuable?",
                "What's the most meaningful way friendship has shaped who you are?",
                "What's something you hope people say about you as a friend?"
            ]
        },
        "Vulnerabilities": {
            universal: [
                "What's something you're afraid of that you don't often admit?",
                "What's an insecurity you have that you're working on?",
                "What's something about yourself that you're still learning to accept?",
                "What's a fear you have about the future?",
                "What's something you need more of in your life right now?"
            ],
            family: [
                "What's a fear you have about our family's future?",
                "What's something you worry about when it comes to our family?",
                "What's an insecurity you have about your role in our family?",
                "What's something you're afraid to ask our family for?",
                "What's a way you feel vulnerable within our family?"
            ],
            romantic: [
                "What's a fear you have about our relationship that you don't often share?",
                "What's something you're insecure about in our relationship?",
                "What's something you need from me that you're afraid to ask for?",
                "What's a way you feel most vulnerable with me?",
                "What's something about loving me that scares you?"
            ],
            friends: [
                "What's something you're insecure about in your friendships?",
                "What's a fear you have about maintaining friendships as life changes?",
                "What's something you're afraid to ask your friends for?",
                "What's a way you feel vulnerable in friendships?",
                "What's something about yourself that you're afraid friends might judge?"
            ]
        },
        "Future": {
            universal: [
                "What do you hope people remember about you after you're gone?",
                "What's something you want to make sure happens before you die?",
                "What legacy do you want to leave behind?",
                "What's something you hope the world becomes in your lifetime?",
                "What do you want your life to have meant?"
            ],
            family: [
                "What do you hope our family legacy will be?",
                "What's something you want to make sure never changes about our family?",
                "What do you hope future generations of our family will know about this time in our lives?",
                "What's something you want to make sure gets passed down in our family?",
                "How do you hope our family continues to grow and evolve?"
            ],
            romantic: [
                "What do you hope people say about our love story?",
                "What's something you want to make sure we experience together before we die?",
                "How do you hope we'll still love each other when we're old?",
                "What legacy do you want our relationship to leave?",
                "What's something you want our love to inspire in others?"
            ],
            friends: [
                "What kind of friend do you want to be remembered as?",
                "What's something you want to make sure happens in your friendships?",
                "How do you hope your friendships continue to evolve?",
                "What do you want your friendships to have added to your life when you look back?",
                "What's something you hope to give to your friends over the years?"
            ]
        }
    }
};

// Function to get questions for specific relationship and round/category
function getQuestionsForCategory(round, category, relationshipType) {
    if (!questionsDatabase[round] || !questionsDatabase[round][category]) {
        console.error(`No questions found for Round ${round}, Category ${category}`);
        return [];
    }
    
    const categoryQuestions = questionsDatabase[round][category];
    
    // Determine which question set to use based on relationship type
    let questionSet = [];
    
    // Map relationship types to question categories
    const familyRelationships = [
        'brother-brother', 'sister-sister', 'brother-sister',
        'mother-son', 'mother-daughter', 'father-son', 'father-daughter',
        'grandfather-grandson', 'grandfather-granddaughter', 
        'grandmother-grandson', 'grandmother-granddaughter',
        'male-cousins', 'female-cousins', 'mixed-cousins'
    ];
    
    const romanticRelationships = [
        'new-dating', 'long-term-partners', 'engaged', 'married'
    ];
    
    const friendRelationships = [
        'best-friends-same', 'best-friends-different', 'new-friends',
        'childhood-friends', 'work-friends', 'online-friends'
    ];
    
    // Select appropriate question set
    if (familyRelationships.includes(relationshipType)) {
        questionSet = [...(categoryQuestions.family || []), ...(categoryQuestions.universal || [])];
    } else if (romanticRelationships.includes(relationshipType)) {
        questionSet = [...(categoryQuestions.romantic || []), ...(categoryQuestions.universal || [])];
    } else if (friendRelationships.includes(relationshipType)) {
        questionSet = [...(categoryQuestions.friends || []), ...(categoryQuestions.universal || [])];
    } else {
        // Default to universal questions for unrecognized relationship types
        questionSet = categoryQuestions.universal || [];
    }
    
    return questionSet;
}

// Updated function for script.js to use
function getRandomQuestion(category, relationshipType, round) {
    const questions = getQuestionsForCategory(round, category, relationshipType);
    
    if (questions.length === 0) {
        console.error(`No questions available for Round ${round}, Category ${category}, Relationship ${relationshipType}`);
        return null;
    }
    
    // Return a random question from the available set
    return questions[Math.floor(Math.random() * questions.length)];
}

console.log('Questions database loaded with', Object.keys(questionsDatabase).length, 'rounds');