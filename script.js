// Game State Variables
let currentRelationshipType = '';
let player1Name = '';
let player2Name = '';
let currentRound = 1;
let currentPlayer = 1; // 1 or 2
let roundTurns = 0; // tracks turns within current round (max 2 per round)
let gameData = null;

// Round configurations with categories for each round
const roundConfigs = {
    1: {
        title: "Round 1 - Getting Started",
        subtitle: "Let's begin with some lighter questions",
        categories: ["Favorites", "Daily Life", "Fun Facts"]
    },
    2: {
        title: "Round 2 - Personal Preferences", 
        subtitle: "Diving a bit deeper into your preferences",
        categories: ["Choices", "Experiences", "Personality"]
    },
    3: {
        title: "Round 3 - Values & Perspectives",
        subtitle: "Exploring what matters to you",
        categories: ["Beliefs", "Relationships", "Growth"]
    },
    4: {
        title: "Round 4 - Deeper Connections",
        subtitle: "Sharing more meaningful experiences",
        categories: ["Memories", "Emotions", "Dreams"]
    },
    5: {
        title: "Round 5 - Most Vulnerable",
        subtitle: "The deepest level of sharing",
        categories: ["Reflections", "Vulnerabilities", "Future"]
    }
};

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    console.log('Connection & Discover App Initialized');
    showScreen('welcome-screen');
});

// Screen Management Functions
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function showRelationshipSelection() {
    showScreen('relationship-screen');
}

function selectRelationship(relationshipType) {
    currentRelationshipType = relationshipType;
    console.log('Selected relationship:', relationshipType);
    
    // Visual feedback for selection
    const relationshipBtns = document.querySelectorAll('.relationship-btn');
    relationshipBtns.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Brief delay then move to setup
    setTimeout(() => {
        showScreen('setup-screen');
    }, 500);
}

function startGame() {
    // Get player names
    player1Name = document.getElementById('player1-name').value.trim();
    player2Name = document.getElementById('player2-name').value.trim();
    
    // Validate names
    if (!player1Name || !player2Name) {
        alert('Please enter both player names');
        return;
    }
    
    console.log('Starting game with:', player1Name, 'and', player2Name);
    console.log('Relationship type:', currentRelationshipType);
    
    // Initialize game state
    currentRound = 1;
    currentPlayer = 1;
    roundTurns = 0;
    
    // Start first round
    startRound(1);
}

function startRound(roundNumber) {
    currentRound = roundNumber;
    roundTurns = 0;
    currentPlayer = 1;
    
    console.log(`Starting Round ${roundNumber}`);
    
    // Update round display
    const roundConfig = roundConfigs[roundNumber];
    document.getElementById('round-title').textContent = roundConfig.title;
    document.getElementById('round-subtitle').textContent = roundConfig.subtitle;
    
    // Update turn info
    updateTurnDisplay();
    
    // Show available categories for this round
    displayCategories(roundConfig.categories);
    
    // Show game screen
    showScreen('game-screen');
    
    // Show category selection, hide question display
    document.getElementById('category-selection').style.display = 'block';
    document.getElementById('question-display').classList.add('hidden');
    document.getElementById('round-complete').classList.add('hidden');
}

function updateTurnDisplay() {
    const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
    const otherPlayerName = currentPlayer === 1 ? player2Name : player1Name;
    document.getElementById('current-turn').textContent = 
        `${currentPlayerName}'s turn to choose and ask ${otherPlayerName}`;
}

function displayCategories(categories) {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.onclick = () => selectCategory(category);
        container.appendChild(btn);
    });
}

function selectCategory(category) {
    console.log(`Player ${currentPlayer} selected category: ${category}`);
    
    // Get a random question from this category for current relationship and round
    const question = getRandomQuestion(category, currentRelationshipType, currentRound);
    
    if (question) {
        displayQuestion(category, question);
    } else {
        console.error('No question found for category:', category);
        alert('Sorry, no questions available for this category. Please try another.');
    }
}

function getRandomQuestion(category, relationshipType, round) {
    // This will get questions from questions.js
    // For now, using placeholder - we'll implement the full question system next
    const placeholderQuestions = {
        "Favorites": [
            "What's your favorite way to spend a weekend?",
            "What's your favorite childhood memory involving food?",
            "What's your favorite place you've ever visited?"
        ],
        "Daily Life": [
            "What does a typical morning look like for you?",
            "What's one habit you're trying to develop?",
            "How do you usually unwind after a long day?"
        ],
        "Fun Facts": [
            "What's the most interesting thing you've learned recently?",
            "What's a skill you'd love to master?",
            "What's something most people don't know about you?"
        ]
    };
    
    const categoryQuestions = placeholderQuestions[category];
    if (categoryQuestions && categoryQuestions.length > 0) {
        return categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
    }
    return null;
}

function displayQuestion(category, question) {
    // Hide category selection
    document.getElementById('category-selection').style.display = 'none';
    
    // Show question display
    document.getElementById('question-display').classList.remove('hidden');
    
    // Set question content
    document.getElementById('question-category').textContent = category;
    document.getElementById('question-text').textContent = question;
    
    console.log(`Displaying question: ${question}`);
}

function nextTurn() {
    roundTurns++;
    
    if (roundTurns >= 2) {
        // Round is complete (both players have asked)
        completeRound();
    } else {
        // Switch to other player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        
        // Update turn display
        updateTurnDisplay();
        
        // Show category selection again
        document.getElementById('category-selection').style.display = 'block';
        document.getElementById('question-display').classList.add('hidden');
        
        // Display categories for this round again
        const roundConfig = roundConfigs[currentRound];
        displayCategories(roundConfig.categories);
    }
}

function completeRound() {
    console.log(`Round ${currentRound} completed`);
    
    // Hide question display
    document.getElementById('question-display').classList.add('hidden');
    
    // Show round complete message
    document.getElementById('round-complete').classList.remove('hidden');
}

function nextRound() {
    if (currentRound >= 5) {
        // Game is complete
        completeGame();
    } else {
        // Start next round
        startRound(currentRound + 1);
    }
}

function completeGame() {
    console.log('Game completed!');
    showScreen('complete-screen');
}

function restartGame() {
    // Reset all game state
    currentRelationshipType = '';
    player1Name = '';
    player2Name = '';
    currentRound = 1;
    currentPlayer = 1;
    roundTurns = 0;
    gameData = null;
    
    // Clear input fields
    document.getElementById('player1-name').value = '';
    document.getElementById('player2-name').value = '';
    
    // Remove any selected relationship buttons
    const relationshipBtns = document.querySelectorAll('.relationship-btn');
    relationshipBtns.forEach(btn => btn.classList.remove('selected'));
    
    // Return to welcome screen
    showScreen('welcome-screen');
    
    console.log('Game restarted');
}