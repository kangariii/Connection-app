// Game State Variables
let currentGameMode = ''; // 'connection', 'compatibility', 'knowledge'
let currentRelationshipType = '';
let player1Name = '';
let player2Name = '';
let currentRound = 1;
let currentPlayer = 1; // 1 or 2
let roundTurns = 0; // tracks turns within current round (max 2 per round)
let gameData = null;
let savedQuestions = []; // Track saved questions
let currentQuestion = ''; // Track current question for saving

// Compatibility Test State
let compatibilityCurrentQuestion = 0;
let compatibilityPlayer1Answers = [];
let compatibilityPlayer2Answers = [];
let compatibilityPlayer1Ready = false;
let compatibilityPlayer2Ready = false;
let isProcessingCompatibilityAnswer = false;
let continueListener = null; // Track continue listener to prevent duplicates

// Knowledge Quiz State
let knowledgeQuestionsList = [];
let knowledgeCurrentQuestion = 0;
let knowledgePlayer1Score = 0;
let knowledgePlayer2Score = 0;
let knowledgeCurrentAnswer = '';
let knowledgeCurrentPrediction = '';
let knowledgeAnswerer = 1; // Which player is answering (alternates)

// Multiplayer State Variables
let isOnlineMode = false;
let roomCode = '';
let playerId = '';
let playerNumber = 0; // 1 or 2
let roomPlayers = [];
let gameState = null;
let roomListener = null;
let messagesListener = null;
let isPlayerReady = false; // Track if current player is ready
let isUpdatingState = false; // Prevent concurrent state updates

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

// Screen Management Functions
function showScreen(screenId) {
    console.log(`showScreen() called with screenId: ${screenId}`);
    
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    console.log(`Found ${screens.length} screens to hide`);
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log(`Successfully showed screen: ${screenId}`);
    } else {
        console.error(`Screen with id '${screenId}' not found!`);
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Who Are You? App Initialized - DOM Content Loaded');

    // Show splash screen transition
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.classList.add('fade-out');

        setTimeout(() => {
            showScreen('welcome-screen');
        }, 800); // Wait for fade out to complete
    }, 2500); // Show splash for 2.5 seconds

    // Initialize Firebase
    try {
        const firebaseResult = await initializeFirebase();
        if (firebaseResult) {
            console.log('Firebase initialization completed - Online mode available');
        } else {
            console.log('Firebase initialization failed - Offline mode only');
            isFirebaseConnected = false;
        }
    } catch (error) {
        console.error('Error during Firebase initialization:', error);
        isFirebaseConnected = false;
    }
    
    // Add click event listeners as backup
    const createBtn = document.querySelector('button[onclick="showCreateGame()"]');
    const joinBtn = document.querySelector('button[onclick="showJoinGame()"]');
    
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            console.log('Create Game button clicked via event listener');
            showCreateGame();
        });
        console.log('Create Game button found and event listener added');
        console.log('Create button styles:', window.getComputedStyle(createBtn).pointerEvents);
    } else {
        console.error('Create Game button not found!');
    }
    
    if (joinBtn) {
        joinBtn.addEventListener('click', function() {
            console.log('Join Game button clicked via event listener');
            showJoinGame();
        });
        console.log('Join Game button found and event listener added');
        console.log('Join button styles:', window.getComputedStyle(joinBtn).pointerEvents);
    } else {
        console.error('Join Game button not found!');
    }
});

function showCreateGame() {
    console.log('showCreateGame() called');

    try {
        // Show relationship selection screen
        showScreen('relationship-screen');

    } catch (error) {
        console.error('Error in showCreateGame:', error);
    }
}

function toggleCategory(categoryName) {
    const categoryContent = document.querySelector(`.category-content[data-category="${categoryName}"]`);

    if (!categoryContent) {
        console.error(`Category content not found for: ${categoryName}`);
        return;
    }

    const categoryHeader = categoryContent.previousElementSibling;

    // Close all other categories
    document.querySelectorAll('.category-content').forEach(content => {
        if (content !== categoryContent) {
            content.classList.remove('open');
            if (content.previousElementSibling) {
                content.previousElementSibling.classList.remove('active');
            }
        }
    });

    // Toggle the clicked category
    categoryContent.classList.toggle('open');
    if (categoryHeader) {
        categoryHeader.classList.toggle('active');
    }
}

function showJoinGame() {
    console.log('showJoinGame() called');
    
    try {
        // Simply show the join screen directly
        showScreen('join-screen');
        
    } catch (error) {
        console.error('Error in showJoinGame:', error);
    }
}

function selectRelationship(relationshipType, buttonElement) {
    currentRelationshipType = relationshipType;
    console.log('Selected relationship:', relationshipType);

    // Visual feedback for selection
    const relationshipBtns = document.querySelectorAll('.relationship-btn');
    relationshipBtns.forEach(btn => btn.classList.remove('selected'));
    buttonElement.classList.add('selected');

    // Brief delay then create game room
    setTimeout(() => {
        createGameRoom();
    }, 500);
}

function selectGameMode(mode) {
    currentGameMode = mode;
    console.log('Selected game mode:', mode);

    // Update the selected mode name display
    const modeNames = {
        'connection': 'Deepen Your Connection',
        'compatibility': 'Compatibility Test',
        'knowledge': 'How Well Do You Know Each Other?'
    };

    const modeNameElement = document.getElementById('selected-mode-name');
    if (modeNameElement) {
        modeNameElement.textContent = modeNames[mode] || 'your game';
    }

    // Show create/join selection screen
    showScreen('create-join-screen');
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

    console.log(`Starting Round ${roundNumber} with presentation flow`);

    // Update progress bar
    updateProgressBar();

    const roundConfig = roundConfigs[roundNumber];
    if (!roundConfig) {
        console.error(`No round config found for round ${roundNumber}`);
        alert(`Error: Round ${roundNumber} configuration not found.`);
        return;
    }

    // Show game screen first (hidden state)
    showScreen('game-screen');

    // Reset all display states to hidden
    const elements = [
        'round-header', 'turn-info', 'category-selection',
        'question-display', 'round-complete', 'waiting-state'
    ];

    elements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('show');
            if (elementId !== 'round-header' && elementId !== 'turn-info') {
                element.classList.add('hidden');
            }
        } else {
            console.error(`Element with id '${elementId}' not found`);
        }
    });

    // Start the presentation sequence
    presentRoundFlow(roundNumber, roundConfig);
}

function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const roundNum = document.getElementById('current-round-num');

    if (progressFill && roundNum) {
        const percentage = (currentRound / 5) * 100;
        progressFill.style.width = percentage + '%';
        roundNum.textContent = currentRound;
    }
}

function presentRoundFlow(roundNumber, roundConfig) {
    // Create sequence of messages for this round
    const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
    const playerTurnText = currentPlayerName ? `${currentPlayerName}'s turn` : `Player ${currentPlayer}'s turn`;
    
    console.log(`presentRoundFlow: currentPlayer=${currentPlayer}, player1Name='${player1Name}', player2Name='${player2Name}', currentPlayerName='${currentPlayerName}'`);
    
    const messages = [
        {
            text: `Round ${roundNumber}`,
            type: 'title',
            duration: 2000
        },
        {
            text: roundConfig.subtitle,
            type: 'subtitle', 
            duration: 2500
        },
        {
            text: playerTurnText,
            type: 'message',
            duration: 2000
        }
    ];
    
    // Show sequential messages, then proceed with game setup
    showSequentialMessages(messages, () => {
        // Update game screen content while hidden
        updateTurnDisplay();
        displayCategories(roundConfig.categories);
        
        // Show game elements with staggered animation - skip round header
        setTimeout(() => {
            document.getElementById('turn-info').classList.add('show');
        }, 200);
        
        setTimeout(() => {
            if (isOnlineMode) {
                updateGameDisplay();
            } else {
                showCategorySelection();
            }
        }, 600);
    });
}

// Sequential Message System
function showSequentialMessages(messages, finalCallback) {
    if (!messages || messages.length === 0) {
        if (finalCallback) finalCallback();
        return;
    }

    let currentIndex = 0;

    function showNextMessage() {
        if (currentIndex >= messages.length) {
            // All messages shown - restore progress bar before callback
            const progressContainer = document.querySelector('.progress-container');
            if (progressContainer) {
                progressContainer.style.display = 'block';
            }
            if (finalCallback) finalCallback();
            return;
        }

        const message = messages[currentIndex];
        showMessage(message.text, message.type, message.duration, () => {
            currentIndex++;
            // Small delay between messages for better flow
            setTimeout(showNextMessage, 300);
        });
    }

    showNextMessage();
}

function showMessage(text, type = 'title', duration = 2000, callback) {
    const announcement = document.getElementById('round-announcement');
    const title = document.getElementById('announcement-title');
    const subtitle = document.getElementById('announcement-subtitle');
    const content = announcement?.querySelector('.round-announcement-content');
    const progressContainer = document.querySelector('.progress-container');

    if (!announcement || !title || !subtitle) {
        console.error('Missing announcement elements:', { announcement: !!announcement, title: !!title, subtitle: !!subtitle });
        if (callback) callback();
        return;
    }

    // Hide progress bar during announcements
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    
    // Complete reset of announcement state
    announcement.classList.remove('show', 'hide');
    announcement.style.opacity = '0';
    announcement.style.transform = 'scale(0.8)';
    
    // Reset content animation
    if (content) {
        content.style.animation = 'none';
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.offsetHeight; // Force reflow
    }
    
    // Reset both elements
    title.style.display = 'none';
    subtitle.style.display = 'none';
    title.textContent = '';
    subtitle.textContent = '';
    
    // Set content based on type
    if (type === 'title') {
        title.textContent = text;
        title.style.display = 'block';
        title.style.fontSize = '4rem';
    } else if (type === 'subtitle') {
        subtitle.textContent = text;
        subtitle.style.display = 'block';
        subtitle.style.fontSize = '2rem';
    } else if (type === 'message') {
        subtitle.textContent = text;
        subtitle.style.display = 'block';
        subtitle.style.fontSize = '2.5rem';
    }
    
    // Small delay to ensure reset is complete, then start animation
    setTimeout(() => {
        // Re-enable content animation
        if (content) {
            content.style.animation = 'slideUpFadeIn 0.8s ease-out 0.2s forwards';
        }
        
        // Clear inline styles to let CSS take over
        announcement.style.opacity = '';
        announcement.style.transform = '';
        
        // Show announcement
        announcement.classList.add('show');
    }, 50);
    
    // Auto-hide after duration and trigger callback
    setTimeout(() => {
        announcement.classList.remove('show');
        announcement.classList.add('hide');
        
        // Remove hide class after animation completes
        setTimeout(() => {
            announcement.classList.remove('hide');
            if (callback) callback();
        }, 600);
    }, duration + 50);
}

function showRoundAnnouncement(roundNumber, roundConfig, callback) {
    const announcement = document.getElementById('round-announcement');
    const title = document.getElementById('announcement-title');
    const subtitle = document.getElementById('announcement-subtitle');
    
    // Set content
    title.textContent = `Round ${roundNumber}`;
    subtitle.textContent = roundConfig.subtitle;
    
    // Show announcement
    announcement.classList.add('show');
    
    // Auto-hide after 2.5 seconds and trigger callback
    setTimeout(() => {
        announcement.classList.remove('show');
        announcement.classList.add('hide');
        
        // Remove hide class after animation completes
        setTimeout(() => {
            announcement.classList.remove('hide');
            if (callback) callback();
        }, 600);
    }, 2500);
}

function showCategorySelection() {
    console.log(`showCategorySelection called - Round ${currentRound}`);
    const categorySelection = document.getElementById('category-selection');

    if (!categorySelection) {
        console.error('ERROR: category-selection element not found!');
        return;
    }

    categorySelection.classList.remove('hidden');
    categorySelection.style.display = 'block';
    console.log('Category selection display set to block, hidden class removed');

    // Trigger animation
    setTimeout(() => {
        categorySelection.classList.add('show');
        console.log('Category selection show class added - should be visible now');
    }, 100);
}

function updateTurnDisplay() {
    const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
    const otherPlayerName = currentPlayer === 1 ? player2Name : player1Name;
    console.log(`updateTurnDisplay: Player ${currentPlayer} (${currentPlayerName}) choosing question for ${otherPlayerName}`);
    document.getElementById('current-turn').textContent = 
        `${currentPlayerName}'s turn to choose and ask ${otherPlayerName}`;
}

function displayCategories(categories) {
    console.log(`displayCategories called with: [${categories.join(', ')}] for Round ${currentRound}`);
    const container = document.getElementById('categories-container');

    if (!container) {
        console.error('ERROR: categories-container element not found!');
        return;
    }

    container.innerHTML = '';

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.onclick = () => selectCategory(category);
        container.appendChild(btn);
    });

    console.log(`Created ${categories.length} category buttons`);
}

function selectCategory(category) {
    console.log(`=== SELECT CATEGORY CALLED ===`);
    console.log(`Player ${currentPlayer} selected category: ${category}`);
    console.log(`Current round: ${currentRound}, Relationship: ${currentRelationshipType}`);

    // Validate it's this player's turn
    if (isOnlineMode && playerNumber !== currentPlayer) {
        console.log(`selectCategory: Not player ${playerNumber}'s turn (current turn: ${currentPlayer})`);
        alert(`It's not your turn! Wait for Player ${currentPlayer} to finish.`);
        return;
    }

    // Get a random question from this category for current relationship and round
    const question = getRandomQuestion(category, currentRelationshipType, currentRound);
    console.log(`Question retrieved: ${question ? 'YES' : 'NO'}`);

    if (question) {
        console.log(`Hiding category selection and showing question...`);
        // Hide category selection with animation, then show question
        hideCategorySelection(() => {
            displayQuestionWithAnimation(category, question);
        });
    } else {
        console.error(`CRITICAL ERROR: No question found for category: ${category}, round: ${currentRound}, relationship: ${currentRelationshipType}`);
        alert(`Sorry, no questions available for this category (${category}) in Round ${currentRound}. This is a bug - please try another category or refresh the page.`);
    }
}

function hideCategorySelection(callback) {
    const categorySelection = document.getElementById('category-selection');
    categorySelection.classList.remove('show');
    categorySelection.classList.add('hide');
    
    setTimeout(() => {
        categorySelection.classList.add('hidden');
        categorySelection.style.display = 'none';
        categorySelection.classList.remove('hide');
        if (callback) callback();
    }, 600);
}

function getRandomQuestion(category, relationshipType, round) {
    console.log(`getRandomQuestion: category=${category}, relationshipType=${relationshipType}, round=${round}`);
    
    // Check if questions database exists
    if (typeof questionsDatabase === 'undefined') {
        console.error('Questions database not loaded!');
        return null;
    }
    
    const roundData = questionsDatabase[round];
    if (!roundData) {
        console.error(`No data found for round ${round}`);
        return null;
    }
    
    const categoryData = roundData[category];
    if (!categoryData) {
        console.error(`No data found for category ${category} in round ${round}`);
        return null;
    }
    
    // Map specific relationship types to general categories
    function mapRelationshipType(relationshipType) {
        if (!relationshipType) return 'universal';

        // Family relationships
        if (relationshipType.includes('brother') || relationshipType.includes('sister') ||
            relationshipType.includes('mother') || relationshipType.includes('father') ||
            relationshipType.includes('grandfather') || relationshipType.includes('grandmother') ||
            relationshipType.includes('cousin')) {
            return 'family';
        }

        // Romantic relationships
        if (relationshipType.includes('dating') || relationshipType.includes('engaged') ||
            relationshipType.includes('married') || relationshipType.includes('partners')) {
            return 'romantic';
        }

        // Friend relationships (includes colleagues, roommates, neighbors, etc.)
        if (relationshipType.includes('friend') || relationshipType.includes('colleague') ||
            relationshipType.includes('roommate') || relationshipType.includes('neighbor') ||
            relationshipType.includes('mentor')) {
            return 'friends';
        }

        // Default to universal for unknown types
        return 'universal';
    }
    
    const mappedRelationshipType = mapRelationshipType(relationshipType);
    console.log(`Mapped ${relationshipType} to ${mappedRelationshipType}`);
    
    // Try to get relationship-specific questions first, then fall back to universal
    let questionArray = categoryData[mappedRelationshipType] || categoryData.universal;
    
    if (!questionArray || questionArray.length === 0) {
        console.error(`No questions found for category ${category}, relationship ${relationshipType}, round ${round}`);
        return null;
    }
    
    // Return a random question
    const randomIndex = Math.floor(Math.random() * questionArray.length);
    return questionArray[randomIndex];
}

function displayQuestionWithAnimation(category, question) {
    console.log(`displayQuestionWithAnimation called - Category: ${category}, Question: ${question}`);

    if (!question || question.trim() === '') {
        console.error('ERROR: Attempting to display empty question!');
        alert('Error: No question to display. Please try selecting another category.');
        return;
    }

    // Store current question for saving functionality
    currentQuestion = question;

    // Set question content
    const categoryEl = document.getElementById('question-category');
    const textEl = document.getElementById('question-text');

    if (!categoryEl || !textEl) {
        console.error('ERROR: Question display elements not found in DOM!');
        return;
    }

    categoryEl.textContent = category;
    textEl.textContent = question;
    console.log(`Set question text successfully: "${question.substring(0, 50)}..."`);

    // Reset save button state
    const saveBtn = document.getElementById('save-question-btn');
    if (saveBtn) {
        saveBtn.classList.remove('saved');
        saveBtn.innerHTML = '<span class="heart-icon">♡</span> Save Question';
    }

    // Show question display with animation
    const questionDisplay = document.getElementById('question-display');
    if (!questionDisplay) {
        console.error('ERROR: Question display element not found!');
        return;
    }

    questionDisplay.classList.remove('hidden');
    console.log('Removed hidden class from question display');

    setTimeout(() => {
        questionDisplay.classList.add('show');
        console.log('Added show class to question display - animation should start');
    }, 100);

    console.log(`✓ Question displayed successfully`);
}



function completeRound() {
    console.log(`Round ${currentRound} completed`);
    console.trace('completeRound() called from:');
    console.log(`completeRound: roundTurns=${roundTurns}, currentPlayer=${currentPlayer}, isOnlineMode=${isOnlineMode}`);
    
    // Hide question display
    document.getElementById('question-display').classList.add('hidden');
    
    // Show round completion message sequence
    const messages = [
        {
            text: `Round ${currentRound} Complete!`,
            type: 'title',
            duration: 2000
        }
    ];
    
    showSequentialMessages(messages, () => {
        // Show round complete UI
        document.getElementById('round-complete').classList.remove('hidden');
    });
}

function nextRound() {
    console.log(`nextRound called: currentRound=${currentRound}, isOnlineMode=${isOnlineMode}`);

    // Hide round complete UI first
    document.getElementById('round-complete').classList.add('hidden');

    if (currentRound >= 5) {
        // Game is complete
        completeGame();
    } else {
        // Increment round and reset turns
        currentRound++;
        roundTurns = 0;
        currentPlayer = 1; // Always start new round with player 1
        currentQuestion = ''; // Reset current question for new round

        console.log(`=== STARTING ROUND ${currentRound} ===`);
        console.log(`Reset: roundTurns=0, currentPlayer=1, currentQuestion=''`);

        if (isOnlineMode) {
            // Update game state and sync
            gameState.currentRound = currentRound;
            gameState.roundTurns = roundTurns;
            gameState.currentPlayer = currentPlayer;
            syncGameState().then(() => {
                // Only start the round locally for the person who clicked next
                startRound(currentRound);
            });
        } else {
            // Offline mode - start round directly
            startRound(currentRound);
        }
    }
}

function completeGame() {
    console.log('Game completed!');
    
    // Hide the current screen immediately to prevent flashing
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.classList.remove('active');
    }
    
    const messages = [
        { text: "Journey Complete!", type: "title", duration: 2000 },
        { text: "Thank you for connecting", type: "subtitle", duration: 2500 },
        { text: "You've shared meaningful moments", type: "subtitle", duration: 2500 },
        { text: "And learned something new", type: "subtitle", duration: 2500 },
        { text: "The strongest connections are built", type: "subtitle", duration: 2500 },
        { text: "One conversation at a time", type: "subtitle", duration: 3000 }
    ];
    
    showSequentialMessages(messages, () => {
        showScreen('complete-screen');
        setTimeout(() => {
            displaySavedQuestions();
            document.getElementById('complete-content').style.display = 'block';
            document.getElementById('complete-content').classList.add('show');
        }, 1000);
    });
}

function displaySavedQuestions() {
    const summaryDiv = document.getElementById('saved-questions-summary');

    if (savedQuestions.length > 0) {
        summaryDiv.innerHTML = `
            <h3>Your Saved Questions (${savedQuestions.length})</h3>
            <ul>
                ${savedQuestions.map(q => `<li>${q}</li>`).join('')}
            </ul>
        `;
    } else {
        summaryDiv.innerHTML = '';
    }
}

function restartGame() {
    console.log('restartGame() called - starting cleanup and reset');
    
    // Clean up Firebase listeners
    if (roomListener) {
        roomListener();
        roomListener = null;
    }
    if (messagesListener) {
        messagesListener();
        messagesListener = null;
    }
    
    // Disconnect from room (non-blocking)
    if (isOnlineMode && roomCode && playerId) {
        disconnectPlayer(roomCode, playerId).catch(error => {
            console.log('Error disconnecting player (ignored):', error);
        });
    }
    
    // Reset all game state
    currentGameMode = '';
    currentRelationshipType = '';
    player1Name = '';
    player2Name = '';
    currentRound = 1;
    currentPlayer = 1;
    roundTurns = 0;
    gameData = null;

    // Reset compatibility state
    compatibilityCurrentQuestion = 0;
    compatibilityPlayer1Answers = [];
    compatibilityPlayer2Answers = [];
    compatibilityPlayer1Ready = false;
    compatibilityPlayer2Ready = false;

    // Reset knowledge quiz state
    knowledgeQuestionsList = [];
    knowledgeCurrentQuestion = 0;
    knowledgePlayer1Score = 0;
    knowledgePlayer2Score = 0;
    knowledgeCurrentAnswer = '';
    knowledgeCurrentPrediction = '';
    knowledgeAnswerer = 1;

    // Reset multiplayer state
    isOnlineMode = false;
    roomCode = '';
    playerId = '';
    playerNumber = 0;
    roomPlayers = [];
    gameState = null;
    isPlayerReady = false;
    isUpdatingState = false;

    // Clear input fields
    document.getElementById('player1-name').value = '';
    document.getElementById('player2-name').value = '';
    document.getElementById('your-name').value = '';
    document.getElementById('room-code-input').value = '';

    // Reset category dropdowns
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.remove('open');
    });
    document.querySelectorAll('.category-header').forEach(header => {
        header.classList.remove('active');
    });

    // Reset lobby and complete content
    const lobbyInfo = document.getElementById('lobby-info');
    if (lobbyInfo) {
        lobbyInfo.style.display = 'none';
        lobbyInfo.classList.remove('show');
    }
    
    const completeContent = document.getElementById('complete-content');
    if (completeContent) {
        completeContent.style.display = 'none';
        completeContent.classList.remove('show');
    }
    
    // Hide join room input
    document.getElementById('join-room-input').classList.add('hidden');
    
    // Remove any selected relationship buttons
    const relationshipBtns = document.querySelectorAll('.relationship-btn');
    relationshipBtns.forEach(btn => btn.classList.remove('selected'));
    
    // Return to welcome screen
    console.log('restartGame() - about to call showScreen(welcome-screen)');
    showScreen('welcome-screen');
    
    console.log('Game restarted - should now be on welcome screen');

    // Clear saved questions
    savedQuestions = [];
}

// Save & Share Functions
function saveQuestion() {
    const saveBtn = document.getElementById('save-question-btn');

    // Check if already saved
    if (savedQuestions.includes(currentQuestion)) {
        // Unsave
        savedQuestions = savedQuestions.filter(q => q !== currentQuestion);
        saveBtn.classList.remove('saved');
        saveBtn.innerHTML = '<span class="heart-icon">♡</span> Save Question';
    } else {
        // Save
        savedQuestions.push(currentQuestion);
        saveBtn.classList.add('saved');
        saveBtn.innerHTML = '<span class="heart-icon">♥</span> Saved';
    }
}

function shareExperience() {
    const shareText = `I just deepened my connection with someone special using Who Are You! 💭 We explored meaningful questions and created lasting memories. Try it yourself!`;

    if (navigator.share) {
        navigator.share({
            title: 'Who Are You?',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Share cancelled', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText + '\n' + window.location.href).then(() => {
            alert('Share text copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}

// Multiplayer Functions

function generateRoomCode() {
    const words = [
        'APPLE', 'BRAVE', 'CLOUD', 'DREAM', 'EAGLE', 'FLAME', 'GRACE',
        'HEART', 'IVORY', 'JEWEL', 'KNIGHT', 'LIGHT', 'MAGIC', 'NORTH',
        'OCEAN', 'PEACE', 'QUEST', 'RIVER', 'STORM', 'TOWER', 'UNITY',
        'VOICE', 'WAVES', 'YOUTH', 'ZONES', 'BEACH', 'CHAIR', 'DANCE',
        'EARTH', 'FOCUS', 'GIANT', 'HOUSE', 'IMAGE', 'JOLLY', 'KNEEL',
        'LAUGH', 'MOUSE', 'NOVEL', 'ORBIT', 'PIANO', 'QUICK', 'RAPID',
        'SMILE', 'TASTE', 'ULTRA', 'VALUE', 'WORLD', 'EXTRA', 'YIELD'
    ];
    
    return words[Math.floor(Math.random() * words.length)];
}

async function createGameRoom() {
    isOnlineMode = true; // Set online mode
    roomCode = generateRoomCode();
    playerId = 'player-' + Math.random().toString(36).substring(2, 9);
    playerNumber = 1;
    
    // Hide the current screen immediately to prevent flashing
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.classList.remove('active');
    }
    
    const messages = [
        { text: "Creating Your Game", type: "title", duration: 1500 },
        { text: `Room Code: ${roomCode}`, type: "subtitle", duration: 2000 },
        { text: "Share this code with your partner", type: "subtitle", duration: 2500 }
    ];
    
    showSequentialMessages(messages, () => {
        document.getElementById('room-code-display').textContent = roomCode;
        document.getElementById('lobby-status').textContent = 'Waiting...';
        showScreen('lobby-screen');
        showLobbyContent();
        
        createRoom(roomCode, playerId, currentRelationshipType, currentGameMode)
            .then(() => {
                isOnlineMode = true;
                setupRoomListeners();
                document.getElementById('lobby-status').textContent = 'Waiting...';
            })
            .catch(error => {
                console.error('Failed to create room:', error);
                // Fall back to offline mode instead of failing
                console.log('Switching to offline mode due to connection failure');
                isOnlineMode = false;
                isFirebaseConnected = false;
                document.getElementById('lobby-status').textContent = 'Offline mode - Ready to begin';
                
                // Enable the start button for offline play
                document.getElementById('start-online-game').disabled = false;
                document.getElementById('start-online-game').textContent = 'Begin Journey (Offline)';
            });
    });
}

async function joinGameRoom() {
    const inputCode = document.getElementById('room-code-input').value.trim().toUpperCase();
    if (!inputCode || !inputCode.match(/^[A-Z]{4,7}$/)) {
        alert('Please enter a valid game code (4-7 letter word)');
        return;
    }
    
    isOnlineMode = true; // Set online mode
    roomCode = inputCode;
    playerId = 'player-' + Math.random().toString(36).substring(2, 9);
    playerNumber = 2;
    
    // Hide the current screen immediately to prevent flashing
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.classList.remove('active');
    }
    
    const messages = [
        { text: "Joining Game", type: "title", duration: 1500 },
        { text: `Room Code: ${roomCode}`, type: "subtitle", duration: 2000 },
        { text: "Connecting to your partner", type: "subtitle", duration: 2000 }
    ];
    
    showSequentialMessages(messages, () => {
        document.getElementById('room-code-display').textContent = roomCode;
        document.getElementById('lobby-status').textContent = 'Waiting...';
        showScreen('lobby-screen');
        showLobbyContent();
        
        joinRoom(roomCode, playerId, 'Player 2')
            .then(() => {
                isOnlineMode = true;
                setupRoomListeners();
                document.getElementById('lobby-status').textContent = 'Ready to begin?';
            })
            .catch(error => {
                console.error('Failed to join game:', error);
                // Fall back to offline mode instead of failing
                console.log('Switching to offline mode due to connection failure');
                isOnlineMode = false;
                isFirebaseConnected = false;
                document.getElementById('lobby-status').textContent = 'Offline mode - Ready to begin';
                
                // Enable the start button for offline play
                document.getElementById('start-online-game').disabled = false;
                document.getElementById('start-online-game').textContent = 'Begin Journey (Offline)';
            });
    });
}

function showLobbyContent() {
    setTimeout(() => {
        const lobbyInfo = document.getElementById('lobby-info');
        lobbyInfo.style.display = 'block';
        setTimeout(() => {
            lobbyInfo.classList.add('show');
        }, 100);
    }, 500);
}

function setupRoomListeners() {
    if (!isFirebaseConnected) {
        console.log('Firebase not connected, using offline mode');
        return;
    }
    
    // Listen to room changes
    roomListener = listenToRoom(roomCode, (snapshot) => {
        const roomData = snapshot.val();
        if (roomData) {
            handleRoomUpdate(roomData);
        }
    });
    
    // Listen to messages
    messagesListener = listenToMessages(roomCode, (snapshot) => {
        const messageData = snapshot.val();
        if (messageData && messageData.timestamp) {
            handleFirebaseMessage(messageData);
        }
    });
    
    // Handle disconnect
    window.addEventListener('beforeunload', () => {
        disconnectPlayer(roomCode, playerId);
    });
}

function handleRoomUpdate(roomData) {
    const players = roomData.players || {};
    const playerList = Object.values(players).filter(p => p.connected);

    // Set relationship type from room data if not already set (for joining players)
    if (roomData.relationshipType && !currentRelationshipType) {
        currentRelationshipType = roomData.relationshipType;
    }

    // Set game mode from room data if not already set (for joining players)
    if (roomData.gameMode && !currentGameMode) {
        currentGameMode = roomData.gameMode;
        console.log(`Received game mode from room: ${currentGameMode}`);
    }
    
    // Update players display (removed for cleaner UI)
    // updatePlayersDisplay();
    
    // Check if both players are connected
    if (playerList.length >= 2) {
        // Check if both players are ready
        const readyPlayers = playerList.filter(p => p.ready);
        if (readyPlayers.length >= 2) {
            // Both players are ready
            if (roomData.gameState && roomData.gameState.gameStarted) {
                // Game already started, receive the game state
                receiveGameState(roomData.gameState);
            } else {
                // Both ready but game not started yet - enable button and allow game start
                document.getElementById('lobby-status').textContent = 'Ready to begin!';
                document.getElementById('start-online-game').disabled = false;
            }
        } else {
            document.getElementById('lobby-status').textContent = 'Waiting...';
            document.getElementById('start-online-game').disabled = false;
        }
    } else {
        document.getElementById('lobby-status').textContent = 'Waiting...';
        document.getElementById('start-online-game').disabled = true;
    }
}

function handleFirebaseMessage(messageData) {
    switch (messageData.type) {
        // No message types currently needed - each player chooses independently
        default:
            console.log('Unknown message type:', messageData.type);
            break;
    }
}

function updatePlayersDisplay() {
    // Players display removed for cleaner UI
    // This function is kept for compatibility but does nothing
}

async function startOnlineGame() {
    const yourName = document.getElementById('your-name').value.trim();
    if (!yourName) {
        alert('Please enter your name');
        return;
    }
    
    // Check if Firebase is connected, if not start offline game
    if (!isFirebaseConnected) {
        console.log('Starting offline game');
        // Set player names for offline mode
        player1Name = yourName;
        player2Name = 'Player 2'; // Default for offline
        
        // Start the game directly in offline mode
        startGame();
        return;
    }
    
    try {
        // Mark this player as ready
        isPlayerReady = true;
        await database.ref(`rooms/${roomCode}/players/${playerId}`).update({
            name: yourName,
            ready: true
        });
        
        // Check if both players are ready
        const roomSnapshot = await database.ref(`rooms/${roomCode}`).once('value');
        const roomData = roomSnapshot.val();
        
        if (roomData && roomData.players) {
            const players = Object.values(roomData.players);
            const readyPlayers = players.filter(p => p.connected && p.ready);
            
            if (readyPlayers.length >= 2) {
                // Both players are ready, initialize game state
                gameState = {
                    gameMode: currentGameMode,
                    relationshipType: currentRelationshipType,
                    currentRound: 1,
                    currentPlayer: 1,
                    roundTurns: 0,
                    gameStarted: true,
                    player1Name: players.find(p => p.playerNumber === 1)?.name || 'Player 1',
                    player2Name: players.find(p => p.playerNumber === 2)?.name || 'Player 2'
                };
                
                // Update names
                player1Name = gameState.player1Name;
                player2Name = gameState.player2Name;
                
                // Only player 1 (host) updates the game state in Firebase
                if (playerNumber === 1) {
                    try {
                        await syncGameState();
                        console.log('Game state synced, starting game for host');
                        // Only the host starts the game locally, others will receive via gameState
                        startGameByMode();
                    } catch (error) {
                        console.error('Failed to sync game state, starting offline:', error);
                        // Fall back to offline mode
                        isOnlineMode = false;
                        startGameByMode();
                    }
                } else {
                    // Player 2 waits for game state update from Firebase
                    console.log('Player 2 waiting for game state from host...');
                }
                
                document.getElementById('lobby-status').textContent = 'Starting...';
            } else {
                document.getElementById('lobby-status').textContent = 'Waiting...';
                // Don't disable the button - let handleRoomUpdate manage button state
            }
        }
    } catch (error) {
        console.error('Failed to start online game:', error);
        alert('Failed to start game. Please try again.');
    }
}

async function syncGameState() {
    if (!isOnlineMode || !isFirebaseConnected) {
        return Promise.resolve();
    }
    
    try {
        await updateGameState(roomCode, gameState);
        console.log('Game state synced to Firebase');
        return Promise.resolve();
    } catch (error) {
        console.error('Failed to sync game state:', error);
        return Promise.reject(error);
    }
}

function receiveGameState(newGameState) {
    console.log(`receiveGameState called. Current round: ${currentRound}, New round: ${newGameState.currentRound}, roundTurns: ${newGameState.roundTurns}`);

    const oldRound = currentRound;
    gameState = newGameState;

    // Update local game variables from Firebase state
    currentGameMode = gameState.gameMode || 'connection';
    currentRelationshipType = gameState.relationshipType;
    currentRound = gameState.currentRound;
    currentPlayer = gameState.currentPlayer;
    roundTurns = gameState.roundTurns;
    console.log(`receiveGameState updated local state - Mode: ${currentGameMode}, Round: ${currentRound}, Player: ${currentPlayer}, Turns: ${roundTurns}`);
    player1Name = gameState.player1Name;
    player2Name = gameState.player2Name;
    
    // Start the game if it hasn't started yet and we're not already in a game
    const isInGame = document.getElementById('game-screen').classList.contains('active') ||
                     document.getElementById('compatibility-screen').classList.contains('active') ||
                     document.getElementById('compatibility-comparison-screen').classList.contains('active') ||
                     document.getElementById('compatibility-results-screen').classList.contains('active') ||
                     document.getElementById('knowledge-screen').classList.contains('active') ||
                     document.getElementById('knowledge-results-screen').classList.contains('active');

    if (gameState.gameStarted && !isInGame) {
        console.log('Game started but not in game screen, starting game by mode...');
        startGameByMode();
    } else if (gameState.gameStarted && currentGameMode === 'connection') {
        // Connection mode specific updates
        // Check if this is a new round (round number changed)
        if (oldRound !== currentRound && currentRound > oldRound) {
            console.log(`receiveGameState: New round detected (${oldRound} -> ${currentRound}), starting round`);
            startRound(currentRound);
        } else {
            // Just update the display for the current round
            console.log('receiveGameState calling updateGameDisplay()');
            updateGameDisplay();
        }
    }
}

function updateGameDisplay() {
    console.log(`updateGameDisplay: currentRound=${currentRound}, currentPlayer=${currentPlayer}, roundTurns=${roundTurns}, playerNumber=${playerNumber}`);
    
    // Get round config for categories
    const roundConfig = roundConfigs[currentRound];
    
    // Update turn display
    updateTurnDisplay();
    document.getElementById('turn-info').classList.add('show');
    
    // Check if round is complete first
    if (roundTurns >= 2) {
        console.log('updateGameDisplay: Round complete, showing round complete UI');
        document.getElementById('category-selection').classList.remove('show');
        document.getElementById('category-selection').classList.add('hidden');
        document.getElementById('waiting-state').classList.add('hidden');
        document.getElementById('question-display').classList.remove('show');
        document.getElementById('question-display').classList.add('hidden');
        document.getElementById('round-complete').classList.remove('hidden');
        return;
    }
    
    // Show appropriate UI based on whose turn it is
    const isMyTurn = (playerNumber === currentPlayer);
    console.log(`updateGameDisplay: isMyTurn=${isMyTurn}`);
    
    if (isMyTurn) {
        // Only show categories if we're not already displaying a question and round isn't complete
        const questionDisplay = document.getElementById('question-display');
        const questionHidden = questionDisplay.classList.contains('hidden');
        console.log(`updateGameDisplay: My turn, question hidden: ${questionHidden}`);
        
        if (questionHidden) {
            console.log('updateGameDisplay: Showing category selection for my turn');
            document.getElementById('waiting-state').classList.add('hidden');
            document.getElementById('round-complete').classList.add('hidden');
            displayCategories(roundConfig.categories);
            showCategorySelection();
        } else {
            console.log('updateGameDisplay: Question already displayed, not showing categories');
        }
    } else {
        // Show waiting state when it's not my turn
        console.log('updateGameDisplay: Showing waiting state - not my turn');
        document.getElementById('category-selection').classList.remove('show');
        document.getElementById('category-selection').classList.add('hidden');
        document.getElementById('waiting-state').classList.remove('hidden');
        
        // Update waiting message based on current player
        const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
        const waitingMessage = `${currentPlayerName} is choosing a question to ask you. Get ready to share and listen!`;
        document.getElementById('waiting-message').textContent = waitingMessage;
    }
}

// Removed receiveQuestionSelection - each player chooses their own question independently

function nextTurn() {
    console.log(`nextTurn called: isOnlineMode=${isOnlineMode}, roundTurns before increment: ${roundTurns}`);

    // Validate that a question was actually displayed
    if (!currentQuestion || currentQuestion.trim() === '') {
        console.error('ERROR: nextTurn called without a question being displayed!');
        alert('Please select a category and answer a question before continuing.');
        return;
    }

    // Prevent concurrent updates in online mode
    if (isOnlineMode && isUpdatingState) {
        console.log('nextTurn: State update in progress, ignoring call');
        return;
    }

    isUpdatingState = true;
    
    // First increment roundTurns to track completed turns
    roundTurns++;
    console.log(`roundTurns after increment: ${roundTurns}`);
    
    if (roundTurns >= 2) {
        // Round is complete (both players have asked)
        console.log('Round complete - calling completeRound()');
        completeRound();
        
        // Only sync state in online mode, don't duplicate the logic
        if (isOnlineMode) {
            gameState.roundTurns = roundTurns;
            syncGameState().finally(() => {
                isUpdatingState = false;
            });
        } else {
            isUpdatingState = false;
        }
    } else {
        // Switch to other player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        currentQuestion = ''; // Reset for next player's turn
        console.log(`Switched to player ${currentPlayer}, reset currentQuestion`);
        
        if (isOnlineMode) {
            // In online mode, update state and sync
            gameState.currentPlayer = currentPlayer;
            gameState.roundTurns = roundTurns;
            
            // Hide previous player's question display with animation
            const questionDisplay = document.getElementById('question-display');
            questionDisplay.classList.remove('show');
            
            setTimeout(() => {
                questionDisplay.classList.add('hidden');
                
                // Show turn transition message for online mode too
                const newPlayerName = currentPlayer === 1 ? player1Name : player2Name;
                const isMyTurn = (playerNumber === currentPlayer);
                const messages = [
                    {
                        text: isMyTurn ? `Your turn` : `${newPlayerName}'s turn`,
                        type: 'message',
                        duration: 1500
                    }
                ];
                
                showSequentialMessages(messages, () => {
                    syncGameState().then(() => {
                        updateGameDisplay();
                    }).finally(() => {
                        isUpdatingState = false;
                    });
                });
            }, 400);
        } else {
            // Offline mode - show turn transition message, then show categories
            const questionDisplay = document.getElementById('question-display');
            questionDisplay.classList.remove('show');
            
            setTimeout(() => {
                questionDisplay.classList.add('hidden');
                
                // Show turn transition message
                const newPlayerName = currentPlayer === 1 ? player1Name : player2Name;
                const messages = [
                    {
                        text: `${newPlayerName}'s turn`,
                        type: 'message',
                        duration: 1500
                    }
                ];
                
                showSequentialMessages(messages, () => {
                    // Update turn display
                    updateTurnDisplay();
                    document.getElementById('turn-info').classList.add('show');
                    
                    // Display categories for this round again and show with animation
                    const roundConfig = roundConfigs[currentRound];
                    displayCategories(roundConfig.categories);
                    showCategorySelection();
                    
                    isUpdatingState = false;
                });
            }, 400);
        }
    }
}

// ========================================
// GAME MODE ROUTING
// ========================================

function startGameByMode() {
    console.log(`Starting game in mode: ${currentGameMode}`);

    if (currentGameMode === 'connection') {
        startRound(1);
    } else if (currentGameMode === 'compatibility') {
        startCompatibilityTest();
    } else if (currentGameMode === 'knowledge') {
        startKnowledgeQuiz();
    } else {
        console.error('Unknown game mode:', currentGameMode);
        startRound(1); // Default to connection mode
    }
}

// ========================================
// COMPATIBILITY TEST MODE
// ========================================

function startCompatibilityTest() {
    console.log('🎮 Starting Compatibility Test');

    // CRITICAL FIX: Clean up any existing listeners
    if (compatibilityQuestionListener !== null) {
        database.ref(`rooms/${roomCode}/compatibility/${compatibilityQuestionListener}`).off('value');
        compatibilityQuestionListener = null;
    }
    if (continueListener !== null) {
        database.ref(`rooms/${roomCode}/compatibility/${continueListener.questionIndex}`).off('value', continueListener.callback);
        continueListener = null;
    }

    // Reset compatibility state
    compatibilityCurrentQuestion = 0;
    compatibilityPlayer1Answers = [];
    compatibilityPlayer2Answers = [];
    compatibilityPlayer1Ready = false;
    compatibilityPlayer2Ready = false;
    isProcessingCompatibilityAnswer = false;

    // CRITICAL FIX: Clear all Firebase compatibility data for fresh start
    if (isOnlineMode && isFirebaseConnected && roomCode) {
        console.log('🧹 Clearing old compatibility data from Firebase');
        database.ref(`rooms/${roomCode}/compatibility`).remove().then(() => {
            console.log('✅ Firebase compatibility data cleared');
            // Start first question after cleanup
            displayCompatibilityQuestion();
        }).catch(error => {
            console.error('❌ Error clearing compatibility data:', error);
            // Start anyway
            displayCompatibilityQuestion();
        });
    } else {
        // Offline mode - just start
        displayCompatibilityQuestion();
    }

    // Show compatibility screen
    showScreen('compatibility-screen');
}

let compatibilityQuestionListener = null;

function setupCompatibilityListener() {
    if (!isOnlineMode || !isFirebaseConnected) {
        console.log('⚠️ Skipping listener setup - offline mode or not connected');
        return;
    }

    console.log('🎧 Setting up compatibility listener for question', compatibilityCurrentQuestion);
    console.log('   Player number:', playerNumber);
    console.log('   Room code:', roomCode);

    // Remove old listener if exists
    if (compatibilityQuestionListener !== null) {
        console.log('🧹 Cleaning up old listener for question', compatibilityQuestionListener);
        database.ref(`rooms/${roomCode}/compatibility/${compatibilityQuestionListener}`).off('value');
        compatibilityQuestionListener = null;
    }

    // Listen only to CURRENT question
    const currentQ = compatibilityCurrentQuestion;
    compatibilityQuestionListener = currentQ;

    console.log('📡 Attaching listener to:', `rooms/${roomCode}/compatibility/${currentQ}`);

    database.ref(`rooms/${roomCode}/compatibility/${currentQ}`).on('value', (snapshot) => {
        const data = snapshot.val();

        console.log(`🔔 LISTENER FIRED for Q${currentQ}:`, {
            hasData: !!data,
            data: data,
            currentQuestion: compatibilityCurrentQuestion,
            playerNumber: playerNumber,
            isProcessing: isProcessingCompatibilityAnswer
        });

        if (!data) {
            console.log('   No data yet, waiting...');
            return;
        }

        // CRITICAL FIX: Check if we've already moved past this question
        if (currentQ !== compatibilityCurrentQuestion) {
            console.log('⚠️ Already moved past this question, skipping...');
            return;
        }

        // Prevent race condition by checking if we're already processing
        if (isProcessingCompatibilityAnswer) {
            console.log('⚠️ Already processing answer, skipping...');
            return;
        }

        // Store the other player's answer if available
        if (playerNumber === 1 && data.player2Answer) {
            console.log('📥 Player 1 received Player 2 answer');
            compatibilityPlayer2Answers[currentQ] = data.player2Answer;
            compatibilityPlayer2Ready = true;
        } else if (playerNumber === 2 && data.player1Answer) {
            console.log('📥 Player 2 received Player 1 answer');
            compatibilityPlayer1Answers[currentQ] = data.player1Answer;
            compatibilityPlayer1Ready = true;
        }

        // If both players have answered this question, show comparison
        if (data.player1Answer && data.player2Answer) {
            console.log('✅ BOTH PLAYERS ANSWERED! Showing comparison...');
            console.log('   Player 1 answer:', data.player1Answer);
            console.log('   Player 2 answer:', data.player2Answer);

            // Mark as processing to prevent race condition
            isProcessingCompatibilityAnswer = true;

            // Store answers if not already stored
            if (!compatibilityPlayer1Answers[currentQ]) {
                compatibilityPlayer1Answers[currentQ] = data.player1Answer;
            }
            if (!compatibilityPlayer2Answers[currentQ]) {
                compatibilityPlayer2Answers[currentQ] = data.player2Answer;
            }

            // Reset ready flags
            compatibilityPlayer1Ready = false;
            compatibilityPlayer2Ready = false;

            // Remove listener for this question
            console.log('🧹 Removing listener for Q', currentQ);
            database.ref(`rooms/${roomCode}/compatibility/${currentQ}`).off('value');
            compatibilityQuestionListener = null;

            // Show comparison screen after brief delay
            setTimeout(() => {
                console.log('🎬 Showing comparison screen for Q', currentQ);
                showCompatibilityComparison(currentQ);
                // Reset processing flag after showing comparison
                isProcessingCompatibilityAnswer = false;
            }, 1000);
        } else {
            console.log('⏳ Waiting for other player...', {
                hasPlayer1Answer: !!data.player1Answer,
                hasPlayer2Answer: !!data.player2Answer
            });
        }
    });

    console.log('✅ Listener setup complete for Q', currentQ);
}

function displayCompatibilityQuestion() {
    const questionIndex = compatibilityCurrentQuestion;

    console.log(`displayCompatibilityQuestion called for question ${questionIndex}`);

    if (questionIndex >= compatibilityQuestions.length) {
        // All questions answered
        checkCompatibilityComplete();
        return;
    }

    const question = compatibilityQuestions[questionIndex];

    // Update progress
    const progressFill = document.getElementById('compatibility-progress-fill');
    const questionNum = document.getElementById('compatibility-question-num');
    const percentage = ((questionIndex + 1) / compatibilityQuestions.length) * 100;
    progressFill.style.width = percentage + '%';
    questionNum.textContent = questionIndex + 1;

    // Display question
    document.getElementById('compatibility-question-text').textContent = question.question;

    // Display ranking options
    const answersContainer = document.getElementById('compatibility-answers');
    answersContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.draggable = true;
        rankingItem.dataset.optionId = option.id;

        const rankNumber = document.createElement('span');
        rankNumber.className = 'rank-number';
        rankNumber.textContent = index + 1;

        const optionText = document.createElement('span');
        optionText.className = 'ranking-text';
        optionText.textContent = option.text;

        rankingItem.appendChild(rankNumber);
        rankingItem.appendChild(optionText);
        answersContainer.appendChild(rankingItem);
    });

    // Add drag and drop event listeners
    setupRankingDragAndDrop();

    // Show question display, hide waiting (always show question form when displaying)
    document.getElementById('compatibility-question-display').classList.remove('hidden');
    document.getElementById('compatibility-waiting').classList.add('hidden');

    // Set up listener for this question (online mode only)
    if (isOnlineMode && isFirebaseConnected) {
        setupCompatibilityListener();
    }

    console.log(`Displaying compatibility question ${questionIndex + 1}/${compatibilityQuestions.length}`);
}

// Drag and drop functionality for ranking system
let draggedItem = null;

function setupRankingDragAndDrop() {
    const rankingItems = document.querySelectorAll('.ranking-item');

    rankingItems.forEach(item => {
        // Desktop drag and drop
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);

        // Mobile touch events
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
}

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedItem) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedItem !== this) {
        const container = this.parentNode;
        const allItems = Array.from(container.children);
        const draggedIndex = allItems.indexOf(draggedItem);
        const targetIndex = allItems.indexOf(this);

        if (draggedIndex < targetIndex) {
            this.parentNode.insertBefore(draggedItem, this.nextSibling);
        } else {
            this.parentNode.insertBefore(draggedItem, this);
        }

        // Update rank numbers
        updateRankNumbers();
    }

    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    const items = document.querySelectorAll('.ranking-item');
    items.forEach(item => {
        item.classList.remove('drag-over');
    });
}

function updateRankNumbers() {
    // Only update items in the actual list (not touch clones)
    const rankingItems = document.querySelectorAll('.compatibility-ranking-list .ranking-item:not(.touch-clone)');
    rankingItems.forEach((item, index) => {
        const rankNumber = item.querySelector('.rank-number');
        if (rankNumber) {
            rankNumber.textContent = index + 1;
        }
    });
}

// Touch event handlers for mobile drag and drop
let touchStartY = 0;
let touchedItem = null;
let touchClone = null;

function handleTouchStart(e) {
    touchedItem = this;
    touchStartY = e.touches[0].clientY;

    // Create a visual clone for dragging
    touchClone = this.cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.left = this.getBoundingClientRect().left + 'px';
    touchClone.style.top = e.touches[0].clientY - 20 + 'px';
    touchClone.style.width = this.offsetWidth + 'px';
    touchClone.style.opacity = '0.8';
    touchClone.style.zIndex = '1000';
    touchClone.style.pointerEvents = 'none';
    touchClone.classList.add('touch-clone'); // Mark as clone so updateRankNumbers ignores it
    document.body.appendChild(touchClone);

    this.classList.add('dragging');
    e.preventDefault();
}

function handleTouchMove(e) {
    if (!touchedItem || !touchClone) return;

    e.preventDefault();

    // Move the clone with the touch
    const touch = e.touches[0];
    touchClone.style.top = touch.clientY - 20 + 'px';

    // Find which item we're over
    const items = Array.from(document.querySelectorAll('.ranking-item'));
    const targetItem = items.find(item => {
        if (item === touchedItem) return false;
        const rect = item.getBoundingClientRect();
        return touch.clientY >= rect.top && touch.clientY <= rect.bottom;
    });

    if (targetItem) {
        const container = touchedItem.parentNode;
        const touchedIndex = items.indexOf(touchedItem);
        const targetIndex = items.indexOf(targetItem);

        if (touchedIndex < targetIndex) {
            container.insertBefore(touchedItem, targetItem.nextSibling);
        } else {
            container.insertBefore(touchedItem, targetItem);
        }

        updateRankNumbers();
    }
}

function handleTouchEnd(e) {
    if (!touchedItem) return;

    e.preventDefault();

    // Clean up
    if (touchClone) {
        document.body.removeChild(touchClone);
        touchClone = null;
    }

    touchedItem.classList.remove('dragging');
    touchedItem = null;
    touchStartY = 0;
}

// Submit ranking function
function submitRanking() {
    console.log('Submit ranking called');

    // Get the current ranking order
    const rankingItems = document.querySelectorAll('.ranking-item');
    const ranking = {};

    rankingItems.forEach((item, index) => {
        const optionId = item.dataset.optionId;
        ranking[optionId] = index + 1; // Rank starts at 1
    });

    console.log('Ranking submitted:', ranking);

    // Store ranking
    if (playerNumber === 1 || !isOnlineMode) {
        compatibilityPlayer1Answers[compatibilityCurrentQuestion] = ranking;
        compatibilityPlayer1Ready = true;
    } else {
        compatibilityPlayer2Answers[compatibilityCurrentQuestion] = ranking;
        compatibilityPlayer2Ready = true;
    }

    // Proceed to next question or waiting
    if (isOnlineMode) {
        // Sync answer to Firebase
        syncCompatibilityAnswer(ranking).then(() => {
            // Show waiting state
            document.getElementById('compatibility-question-display').classList.add('hidden');
            document.getElementById('compatibility-waiting').classList.remove('hidden');
        });
    } else {
        // Offline mode - both players answer on same device
        if (!compatibilityPlayer2Answers[compatibilityCurrentQuestion]) {
            // Ask player 2
            alert(`${player2Name}, it's your turn to rank these options!`);
            displayCompatibilityQuestion(); // Redisplay for player 2
        } else {
            // Both answered, show comparison
            setTimeout(() => {
                showCompatibilityComparison(compatibilityCurrentQuestion);
            }, 500);
        }
    }
}

async function syncCompatibilityAnswer(answer) {
    if (!isOnlineMode || !isFirebaseConnected) {
        console.log('Skipping sync - offline mode or not connected');
        return Promise.resolve();
    }

    const currentQ = compatibilityCurrentQuestion;
    const answerKey = playerNumber === 1 ? 'player1Answer' : 'player2Answer';

    console.log('🔄 SYNCING ANSWER:', {
        question: currentQ,
        playerNumber: playerNumber,
        answerKey: answerKey,
        roomCode: roomCode,
        answer: answer
    });

    try {
        await database.ref(`rooms/${roomCode}/compatibility/${currentQ}`).update({
            [answerKey]: answer,
            [`${answerKey}Timestamp`]: Date.now()
        });
        console.log('✅ Compatibility answer synced successfully');

        // Log current Firebase state
        const snapshot = await database.ref(`rooms/${roomCode}/compatibility/${currentQ}`).once('value');
        console.log('📊 Firebase state after sync:', snapshot.val());
    } catch (error) {
        console.error('❌ Failed to sync compatibility answer:', error);
    }
}

function showCompatibilityComparison(questionIndex) {
    console.log('Showing comparison for question', questionIndex);

    const question = compatibilityQuestions[questionIndex];
    const player1Ranking = compatibilityPlayer1Answers[questionIndex];
    const player2Ranking = compatibilityPlayer2Answers[questionIndex];

    // Update question text
    document.getElementById('comparison-question-text').textContent = question.question;

    // Update player names
    document.getElementById('comparison-player1-name').textContent = player1Name;
    document.getElementById('comparison-player2-name').textContent = player2Name;

    // Calculate match percentage for this question
    const matchPercentage = calculateQuestionMatch(player1Ranking, player2Ranking, question.options);
    document.getElementById('comparison-match-percentage').textContent = matchPercentage + '%';

    // Display rankings for both players
    displayPlayerRanking('comparison-player1-rankings', player1Ranking, player2Ranking, question.options);
    displayPlayerRanking('comparison-player2-rankings', player2Ranking, player1Ranking, question.options);

    // Update button text for last question
    const continueBtn = document.querySelector('.continue-btn');
    if (questionIndex === compatibilityQuestions.length - 1) {
        continueBtn.textContent = 'See Final Results';
    } else {
        continueBtn.textContent = 'Continue to Next Question';
    }

    // Show comparison screen
    showScreen('compatibility-comparison-screen');
}

function calculateQuestionMatch(ranking1, ranking2, options) {
    let totalPoints = 0;
    let maxPoints = 0;

    options.forEach(option => {
        const optionId = option.id;
        const rank1 = ranking1[optionId];
        const rank2 = ranking2[optionId];

        const difference = Math.abs(rank1 - rank2);
        const points = 3 - difference;

        totalPoints += points;
        maxPoints += 3;
    });

    return Math.round((totalPoints / maxPoints) * 100);
}

function displayPlayerRanking(containerId, playerRanking, otherPlayerRanking, options) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Create array of options with their ranks
    const rankedOptions = options.map(option => ({
        id: option.id,
        text: option.text,
        rank: playerRanking[option.id]
    }));

    // Sort by rank
    rankedOptions.sort((a, b) => a.rank - b.rank);

    // Display each ranked option
    rankedOptions.forEach(option => {
        const item = document.createElement('div');
        item.className = 'comparison-ranking-item';

        // Check if ranks match
        const otherRank = otherPlayerRanking[option.id];
        const difference = Math.abs(option.rank - otherRank);

        if (difference === 0) {
            item.classList.add('exact-match');
        } else if (difference === 1) {
            item.classList.add('close-match');
        }

        // Rank number
        const rankNumber = document.createElement('span');
        rankNumber.className = 'comparison-rank-number';
        rankNumber.textContent = option.rank;

        // Option text
        const optionText = document.createElement('span');
        optionText.className = 'comparison-ranking-text';
        optionText.textContent = option.text;

        // Match indicator
        const indicator = document.createElement('span');
        indicator.className = 'match-indicator';
        if (difference === 0) {
            indicator.textContent = '✓';
            indicator.style.color = '#4CD964';
        } else if (difference === 1) {
            indicator.textContent = '~';
            indicator.style.color = '#FFCC00';
        } else {
            indicator.textContent = '';
        }

        item.appendChild(rankNumber);
        item.appendChild(optionText);
        item.appendChild(indicator);
        container.appendChild(item);
    });
}

function continueToNextQuestion() {
    console.log('=== CONTINUE BUTTON CLICKED ===');
    console.log('Current question:', compatibilityCurrentQuestion);
    console.log('Is online mode:', isOnlineMode);
    console.log('Is Firebase connected:', isFirebaseConnected);

    if (isOnlineMode && isFirebaseConnected) {
        // Online mode - need to sync with other player
        const currentQ = compatibilityCurrentQuestion;
        const readyKey = playerNumber === 1 ? 'player1Ready' : 'player2Ready';

        console.log('Attempting to mark player as ready...');

        // CRITICAL FIX: Remove any existing continue listener before creating new one
        if (continueListener !== null) {
            database.ref(`rooms/${roomCode}/compatibility/${continueListener.questionIndex}`).off('value', continueListener.callback);
            continueListener = null;
        }

        // Mark this player as ready to continue
        database.ref(`rooms/${roomCode}/compatibility/${currentQ}`).update({
            [readyKey + 'ToContinue']: true
        }).then(() => {
            console.log('✓ Successfully marked as ready to continue');

            // Check if both players are ready
            database.ref(`rooms/${roomCode}/compatibility/${currentQ}`).once('value', (snapshot) => {
                const data = snapshot.val();
                console.log('Checking if both players ready:', data);

                if (data && data.player1ReadyToContinue && data.player2ReadyToContinue) {
                    // Both ready, advance
                    console.log('✓ Both players ready! Advancing...');
                    advanceToNextQuestion();
                } else {
                    // Wait for other player
                    console.log('⏳ Waiting for other player to click continue...');
                    showWaitingForContinue();

                    // Listen for other player's ready status
                    const listenerCallback = (snapshot) => {
                        const data = snapshot.val();
                        console.log('Continue listener fired:', data);

                        // CRITICAL FIX: Check if we've already moved past this question
                        if (currentQ !== compatibilityCurrentQuestion) {
                            console.log('Already moved past this question, cleaning up listener');
                            database.ref(`rooms/${roomCode}/compatibility/${currentQ}`).off('value', listenerCallback);
                            continueListener = null;
                            return;
                        }

                        if (data && data.player1ReadyToContinue && data.player2ReadyToContinue) {
                            // Both ready now, advance
                            console.log('✓ Other player ready! Advancing...');
                            database.ref(`rooms/${roomCode}/compatibility/${currentQ}`).off('value', listenerCallback);
                            continueListener = null;
                            advanceToNextQuestion();
                        }
                    };

                    // Store listener reference for cleanup
                    continueListener = {
                        questionIndex: currentQ,
                        callback: listenerCallback
                    };

                    database.ref(`rooms/${roomCode}/compatibility/${currentQ}`).on('value', listenerCallback);
                }
            });
        }).catch(error => {
            console.error('❌ Error marking as ready:', error);
        });
    } else {
        // Offline mode - just advance directly
        console.log('Offline mode - advancing directly');
        advanceToNextQuestion();
    }
}

function showWaitingForContinue() {
    // Hide comparison screen content, show waiting message
    const comparisonContainer = document.querySelector('.comparison-container');
    if (comparisonContainer) {
        comparisonContainer.innerHTML = `
            <div class="waiting-card" style="margin-top: 50px;">
                <h3>Waiting for your partner...</h3>
                <p>They're reviewing the comparison</p>
                <div class="waiting-animation">
                    <div class="pulse-dot"></div>
                    <div class="pulse-dot"></div>
                    <div class="pulse-dot"></div>
                </div>
            </div>
        `;
    }
}

async function advanceToNextQuestion() {
    console.log('🚀 Advancing to next question');

    // Reset processing flag
    isProcessingCompatibilityAnswer = false;

    const previousQ = compatibilityCurrentQuestion;

    // Move to next question FIRST
    compatibilityCurrentQuestion++;
    console.log(`Moving from Q${previousQ} to Q${compatibilityCurrentQuestion}`);

    // CRITICAL FIX: Clear ready flags AFTER advancing to prevent race condition
    if (isOnlineMode && isFirebaseConnected && previousQ >= 0) {
        console.log(`🧹 Clearing ready flags for Q${previousQ}`);
        try {
            await database.ref(`rooms/${roomCode}/compatibility/${previousQ}`).update({
                player1ReadyToContinue: null,
                player2ReadyToContinue: null
            });
            console.log('✅ Ready flags cleared');
        } catch (error) {
            console.error('❌ Error clearing ready flags:', error);
        }
    }

    if (compatibilityCurrentQuestion >= compatibilityQuestions.length) {
        // All questions answered, show results
        console.log('🏁 All questions complete, showing results');
        showCompatibilityResults();
    } else {
        // CRITICAL FIX: Explicitly show compatibility screen before displaying question
        console.log(`📋 Showing Q${compatibilityCurrentQuestion + 1} screen`);
        showScreen('compatibility-screen');

        // Show next question
        displayCompatibilityQuestion();
    }
}

function checkCompatibilityComplete() {
    if (isOnlineMode) {
        // In online mode, check if both players have all answers
        if (compatibilityPlayer1Answers.length === compatibilityQuestions.length &&
            compatibilityPlayer2Answers.length === compatibilityQuestions.length) {
            showCompatibilityResults();
        }
    } else {
        // Offline mode
        showCompatibilityResults();
    }
}

function showCompatibilityResults() {
    console.log('Showing compatibility results');

    // Calculate compatibility score
    const results = calculateCompatibilityScore(compatibilityPlayer1Answers, compatibilityPlayer2Answers);

    // Show results screen
    showScreen('compatibility-results-screen');

    // Animate score display
    setTimeout(() => {
        document.getElementById('compatibility-results-content').style.display = 'block';

        setTimeout(() => {
            // Animate score number
            animateNumber('compatibility-score-number', 0, results.score, 2000);

            // Set rating and message
            document.getElementById('compatibility-rating').textContent = results.insights.rating;
            document.getElementById('compatibility-message').textContent = results.insights.message;

            // Display breakdown
            displayCompatibilityBreakdown(results.breakdown);

            // Display insights
            displayCompatibilityInsights(results.insights);

            document.getElementById('compatibility-results-content').classList.add('show');
        }, 500);
    }, 1000);
}

function animateNumber(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

function displayCompatibilityBreakdown(breakdown) {
    const container = document.getElementById('compatibility-categories');
    container.innerHTML = '';

    breakdown.forEach(item => {
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'category-score';

        const percentage = (item.points / item.maxPoints) * 100;

        scoreDiv.innerHTML = `
            <span class="category-score-name">${item.category}</span>
            <div class="category-score-bar">
                <div class="category-score-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="category-score-points">${item.points}/${item.maxPoints}</span>
        `;

        container.appendChild(scoreDiv);
    });
}

function displayCompatibilityInsights(insights) {
    const container = document.getElementById('compatibility-insights-content');
    container.innerHTML = '';

    // Strengths
    const strengthsDiv = document.createElement('div');
    strengthsDiv.className = 'insight-item';
    strengthsDiv.innerHTML = `
        <div class="insight-label">Strengths</div>
        <div class="insight-text">${insights.strengths}</div>
    `;
    container.appendChild(strengthsDiv);

    // Growth Areas
    const growthDiv = document.createElement('div');
    growthDiv.className = 'insight-item';
    growthDiv.innerHTML = `
        <div class="insight-label">Growth Areas</div>
        <div class="insight-text">${insights.growth}</div>
    `;
    container.appendChild(growthDiv);
}

function shareCompatibilityResults() {
    const score = document.getElementById('compatibility-score-number').textContent;
    const rating = document.getElementById('compatibility-rating').textContent;

    const shareText = `We scored ${score}% compatibility - ${rating}! 💑 Discover your compatibility with Who Are You!`;

    if (navigator.share) {
        navigator.share({
            title: 'Our Compatibility Results',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Share cancelled', err));
    } else {
        navigator.clipboard.writeText(shareText + '\n' + window.location.href).then(() => {
            alert('Results copied to clipboard!');
        });
    }
}

// ========================================
// KNOWLEDGE QUIZ MODE
// ========================================

function startKnowledgeQuiz() {
    console.log('Starting Knowledge Quiz');

    // Reset knowledge state
    knowledgeCurrentQuestion = 0;
    knowledgePlayer1Score = 0;
    knowledgePlayer2Score = 0;
    knowledgeCurrentAnswer = '';
    knowledgeCurrentPrediction = '';
    knowledgeAnswerer = 1; // Player 1 starts

    // Get random 15 questions
    knowledgeQuestionsList = getRandomKnowledgeQuestions(15);

    // Show knowledge screen
    showScreen('knowledge-screen');

    // Set player names in score bar
    document.getElementById('knowledge-player1-name').textContent = player1Name;
    document.getElementById('knowledge-player2-name').textContent = player2Name;
    document.getElementById('knowledge-player1-score').textContent = '0';
    document.getElementById('knowledge-player2-score').textContent = '0';

    // Start first question
    startKnowledgeQuestion();
}

function startKnowledgeQuestion() {
    if (knowledgeCurrentQuestion >= knowledgeQuestionsList.length) {
        // Quiz complete
        showKnowledgeResults();
        return;
    }

    const question = knowledgeQuestionsList[knowledgeCurrentQuestion];

    // Update progress
    document.getElementById('knowledge-question-num').textContent = knowledgeCurrentQuestion + 1;

    // Hide all phases
    document.getElementById('knowledge-answer-phase').classList.add('hidden');
    document.getElementById('knowledge-predict-phase').classList.add('hidden');
    document.getElementById('knowledge-result-phase').classList.add('hidden');
    document.getElementById('knowledge-waiting').classList.add('hidden');

    // Reset state
    knowledgeCurrentAnswer = '';
    knowledgeCurrentPrediction = '';

    // Show answer phase
    showKnowledgeAnswerPhase(question);
}

function showKnowledgeAnswerPhase(question) {
    const answererName = knowledgeAnswerer === 1 ? player1Name : player2Name;

    document.getElementById('knowledge-question-text').textContent = question.question;
    document.getElementById('knowledge-answerer-name').textContent = answererName;

    // Display options
    const optionsContainer = document.getElementById('knowledge-answer-options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'knowledge-option-btn';
        btn.textContent = option;
        btn.onclick = () => selectKnowledgeAnswer(option, index);
        optionsContainer.appendChild(btn);
    });

    document.getElementById('knowledge-answer-phase').classList.remove('hidden');

    console.log(`${answererName} answering question ${knowledgeCurrentQuestion + 1}`);
}

function selectKnowledgeAnswer(answer, index) {
    knowledgeCurrentAnswer = answer;

    // Visual feedback
    const buttons = document.querySelectorAll('#knowledge-answer-options .knowledge-option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[index].classList.add('selected');

    setTimeout(() => {
        if (isOnlineMode) {
            // Sync answer and show waiting
            syncKnowledgeAnswer(answer).then(() => {
                document.getElementById('knowledge-answer-phase').classList.add('hidden');
                document.getElementById('knowledge-waiting').classList.remove('hidden');
            });
        } else {
            // Offline - move to prediction phase
            showKnowledgePredictPhase();
        }
    }, 800);
}

async function syncKnowledgeAnswer(answer) {
    if (!isOnlineMode || !isFirebaseConnected) {
        return Promise.resolve();
    }

    try {
        await database.ref(`rooms/${roomCode}/knowledge/${knowledgeCurrentQuestion}`).update({
            answer: answer,
            answerer: knowledgeAnswerer,
            timestamp: Date.now()
        });
        console.log('Knowledge answer synced');
    } catch (error) {
        console.error('Failed to sync knowledge answer:', error);
    }
}

function showKnowledgePredictPhase() {
    const question = knowledgeQuestionsList[knowledgeCurrentQuestion];
    const predictorNumber = knowledgeAnswerer === 1 ? 2 : 1;
    const predictorName = predictorNumber === 1 ? player1Name : player2Name;
    const answererName = knowledgeAnswerer === 1 ? player1Name : player2Name;

    // In offline mode, alert to switch players
    if (!isOnlineMode) {
        alert(`${predictorName}, ${answererName} has answered. Now predict what they chose!`);
    }

    document.getElementById('knowledge-predict-question').textContent = question.question;
    document.getElementById('knowledge-predictor-name').textContent = predictorName;

    // Display options (same as answer phase)
    const optionsContainer = document.getElementById('knowledge-predict-options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option) => {
        const btn = document.createElement('button');
        btn.className = 'knowledge-option-btn';
        btn.textContent = option;
        btn.onclick = function() { selectKnowledgePrediction(option, predictorNumber, this); };
        optionsContainer.appendChild(btn);
    });

    document.getElementById('knowledge-answer-phase').classList.add('hidden');
    document.getElementById('knowledge-waiting').classList.add('hidden');
    document.getElementById('knowledge-predict-phase').classList.remove('hidden');

    console.log(`${predictorName} predicting answer`);
}

function selectKnowledgePrediction(prediction, predictorNumber, buttonElement) {
    knowledgeCurrentPrediction = prediction;

    // Visual feedback
    const buttons = document.querySelectorAll('#knowledge-predict-options .knowledge-option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    if (buttonElement) buttonElement.classList.add('selected');

    setTimeout(() => {
        // Check if prediction is correct
        const isCorrect = prediction === knowledgeCurrentAnswer;

        // Update score
        if (isCorrect) {
            if (predictorNumber === 1) {
                knowledgePlayer1Score++;
            } else {
                knowledgePlayer2Score++;
            }
        }

        // Show result
        showKnowledgeResult(isCorrect);
    }, 800);
}

function showKnowledgeResult(isCorrect) {
    const predictorNumber = knowledgeAnswerer === 1 ? 2 : 1;
    const predictorName = predictorNumber === 1 ? player1Name : player2Name;

    // Update UI
    document.getElementById('knowledge-result-icon').textContent = isCorrect ? '✓' : '✗';
    document.getElementById('knowledge-result-icon').className = isCorrect ? 'result-icon correct' : 'result-icon incorrect';
    document.getElementById('knowledge-result-title').textContent = isCorrect ? 'Correct!' : 'Not quite!';
    document.getElementById('knowledge-result-message').textContent = isCorrect ?
        `${predictorName} knows you well!` :
        `${predictorName} was surprised by your answer!`;
    document.getElementById('knowledge-correct-answer').textContent = knowledgeCurrentAnswer;

    // Update scores
    document.getElementById('knowledge-player1-score').textContent = knowledgePlayer1Score;
    document.getElementById('knowledge-player2-score').textContent = knowledgePlayer2Score;

    // Show result phase
    document.getElementById('knowledge-predict-phase').classList.add('hidden');
    document.getElementById('knowledge-result-phase').classList.remove('hidden');

    console.log(`Result: ${isCorrect ? 'Correct' : 'Incorrect'}. Scores - P1: ${knowledgePlayer1Score}, P2: ${knowledgePlayer2Score}`);
}

function nextKnowledgeQuestion() {
    // Alternate answerer
    knowledgeAnswerer = knowledgeAnswerer === 1 ? 2 : 1;

    // Move to next question
    knowledgeCurrentQuestion++;

    // Start next question
    startKnowledgeQuestion();
}

function showKnowledgeResults() {
    console.log('Showing knowledge quiz results');

    showScreen('knowledge-results-screen');

    setTimeout(() => {
        document.getElementById('knowledge-results-content').style.display = 'block';

        // Set final scores
        document.getElementById('knowledge-final-player1-name').textContent = player1Name;
        document.getElementById('knowledge-final-player2-name').textContent = player2Name;
        document.getElementById('knowledge-final-player1-score').textContent = knowledgePlayer1Score;
        document.getElementById('knowledge-final-player2-score').textContent = knowledgePlayer2Score;

        // Calculate percentages
        const totalQuestions = knowledgeQuestionsList.length;
        const p1Percent = Math.round((knowledgePlayer1Score / totalQuestions) * 100);
        const p2Percent = Math.round((knowledgePlayer2Score / totalQuestions) * 100);

        document.getElementById('knowledge-final-player1-percent').textContent = p1Percent;
        document.getElementById('knowledge-final-player2-percent').textContent = p2Percent;

        // Determine winner
        let winnerText, winnerMessage;
        if (knowledgePlayer1Score > knowledgePlayer2Score) {
            winnerText = `${player1Name} wins!`;
            winnerMessage = `${player1Name} knows ${player2Name} better!`;
        } else if (knowledgePlayer2Score > knowledgePlayer1Score) {
            winnerText = `${player2Name} wins!`;
            winnerMessage = `${player2Name} knows ${player1Name} better!`;
        } else {
            winnerText = "It's a tie!";
            winnerMessage = "You both know each other equally well!";
        }

        document.getElementById('knowledge-winner-text').textContent = winnerText;
        document.getElementById('knowledge-winner-message').textContent = winnerMessage;

        document.getElementById('knowledge-results-content').classList.add('show');
    }, 1000);
}

function shareKnowledgeResults() {
    const p1Score = document.getElementById('knowledge-final-player1-score').textContent;
    const p2Score = document.getElementById('knowledge-final-player2-score').textContent;
    const winner = document.getElementById('knowledge-winner-text').textContent;

    const shareText = `${winner} 🎯 Final scores: ${player1Name} ${p1Score} - ${player2Name} ${p2Score}. Test how well you know each other with Who Are You!`;

    if (navigator.share) {
        navigator.share({
            title: 'Knowledge Quiz Results',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Share cancelled', err));
    } else {
        navigator.clipboard.writeText(shareText + '\n' + window.location.href).then(() => {
            alert('Results copied to clipboard!');
        });
    }
}
