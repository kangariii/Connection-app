// Game State Variables
let currentRelationshipType = '';
let player1Name = '';
let player2Name = '';
let currentRound = 1;
let currentPlayer = 1; // 1 or 2
let roundTurns = 0; // tracks turns within current round (max 2 per round)
let gameData = null;

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
    
    // Initialize Firebase
    try {
        await initializeFirebase();
        console.log('Firebase initialization completed');
    } catch (error) {
        console.error('Error during Firebase initialization:', error);
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
    
    console.log('About to show welcome screen');
    showScreen('welcome-screen');
    console.log('Welcome screen should now be visible');
});

let currentCategoryIndex = 0;
const categories = ['family', 'romantic', 'friends', 'other'];

function showCreateGame() {
    console.log('showCreateGame() called');
    console.trace('showCreateGame call stack');
    
    try {
        currentCategoryIndex = 0;
        
        // Hide the current screen immediately to prevent flashing
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen) {
            currentScreen.classList.remove('active');
            console.log('Removed active class from current screen');
        }
        
        const messages = [
            { text: "Choose Your Relationship", type: "title", duration: 1500 },
            { text: "We'll tailor questions just for you", type: "subtitle", duration: 2000 }
        ];
        
        console.log('About to show sequential messages');
        showSequentialMessages(messages, () => {
            console.log('Sequential messages complete, showing relationship screen');
            showScreen('relationship-screen');
            showCurrentCategory();
        });
    } catch (error) {
        console.error('Error in showCreateGame:', error);
    }
}

function showCurrentCategory() {
    const allSections = document.querySelectorAll('.category-section');
    allSections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('show');
    });
    
    const currentSection = document.querySelector(`[data-category="${categories[currentCategoryIndex]}"]`);
    if (currentSection) {
        currentSection.style.display = 'block';
        setTimeout(() => {
            currentSection.classList.add('show');
        }, 100);
    }
}

function showNextCategory() {
    if (currentCategoryIndex < categories.length - 1) {
        currentCategoryIndex++;
        showCurrentCategory();
    }
}

function showPrevCategory() {
    if (currentCategoryIndex > 0) {
        currentCategoryIndex--;
        showCurrentCategory();
    }
}

function showJoinGame() {
    console.log('showJoinGame() called');
    console.trace('showJoinGame call stack');
    
    try {
        // Hide the current screen immediately to prevent flashing
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen) {
            currentScreen.classList.remove('active');
            console.log('Removed active class from current screen');
        }
        
        const messages = [
            { text: "Join a Game", type: "title", duration: 1500 },
            { text: "Enter your partner's game code", type: "subtitle", duration: 2000 }
        ];
        
        console.log('About to show sequential messages');
        showSequentialMessages(messages, () => {
            console.log('Sequential messages complete, showing join screen');
            showScreen('join-screen');
        });
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
    
    if (!announcement || !title || !subtitle) {
        console.error('Missing announcement elements:', { announcement: !!announcement, title: !!title, subtitle: !!subtitle });
        if (callback) callback();
        return;
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
    const categorySelection = document.getElementById('category-selection');
    categorySelection.classList.remove('hidden');
    categorySelection.style.display = 'block';
    
    // Trigger animation
    setTimeout(() => {
        categorySelection.classList.add('show');
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
    
    // Validate it's this player's turn
    if (isOnlineMode && playerNumber !== currentPlayer) {
        console.log(`selectCategory: Not player ${playerNumber}'s turn (current turn: ${currentPlayer})`);
        alert(`It's not your turn! Wait for Player ${currentPlayer} to finish.`);
        return;
    }
    
    // Get a random question from this category for current relationship and round
    const question = getRandomQuestion(category, currentRelationshipType, currentRound);
    
    if (question) {
        // Hide category selection with animation, then show question
        hideCategorySelection(() => {
            displayQuestionWithAnimation(category, question);
        });
    } else {
        console.error('No question found for category:', category);
        alert('Sorry, no questions available for this category. Please try another.');
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

function displayQuestionWithAnimation(category, question) {
    // Set question content
    document.getElementById('question-category').textContent = category;
    document.getElementById('question-text').textContent = question;
    
    // Show question display with animation
    const questionDisplay = document.getElementById('question-display');
    questionDisplay.classList.remove('hidden');
    
    setTimeout(() => {
        questionDisplay.classList.add('show');
    }, 100);
    
    console.log(`Displaying question with animation: ${question}`);
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
    
    if (currentRound >= 5) {
        // Game is complete
        completeGame();
    } else {
        // Increment round and reset turns
        currentRound++;
        roundTurns = 0;
        currentPlayer = 1; // Always start new round with player 1
        
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
            document.getElementById('complete-content').style.display = 'block';
            document.getElementById('complete-content').classList.add('show');
        }, 1000);
    });
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
    currentRelationshipType = '';
    player1Name = '';
    player2Name = '';
    currentRound = 1;
    currentPlayer = 1;
    roundTurns = 0;
    gameData = null;
    
    // Reset multiplayer state
    isOnlineMode = false;
    roomCode = '';
    playerId = '';
    playerNumber = 0;
    roomPlayers = [];
    gameState = null;
    isPlayerReady = false;
    isUpdatingState = false;
    
    // Reset category navigation
    currentCategoryIndex = 0;
    
    // Clear input fields
    document.getElementById('player1-name').value = '';
    document.getElementById('player2-name').value = '';
    document.getElementById('your-name').value = '';
    document.getElementById('room-code-input').value = '';
    
    // Reset category sections
    const allSections = document.querySelectorAll('.category-section');
    allSections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('show');
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
        
        createRoom(roomCode, playerId, currentRelationshipType)
            .then(() => {
                setupRoomListeners();
                document.getElementById('lobby-status').textContent = 'Waiting...';
            })
            .catch(error => {
                console.error('Failed to create room:', error);
                document.getElementById('lobby-status').textContent = 'Connection failed';
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
                setupRoomListeners();
                document.getElementById('lobby-status').textContent = 'Ready to begin?';
            })
            .catch(error => {
                console.error('Failed to join game:', error);
                document.getElementById('lobby-status').textContent = 'Connection failed';
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
    
    // Update players display
    updatePlayersDisplay(playerList.map(p => ({
        name: p.name || `Player ${p.playerNumber}`,
        ready: p.ready || false
    })));
    
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

function updatePlayersDisplay(players) {
    const container = document.getElementById('players-container');
    container.innerHTML = '';
    
    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-item';
        const readyText = player.ready ? ' ✓ Ready' : ' - Not Ready';
        playerDiv.textContent = `${index + 1}. ${player.name}${readyText}`;
        if (player.ready) {
            playerDiv.style.color = '#4CAF50';
            playerDiv.style.fontWeight = '600';
        }
        container.appendChild(playerDiv);
    });
}

async function startOnlineGame() {
    const yourName = document.getElementById('your-name').value.trim();
    if (!yourName) {
        alert('Please enter your name');
        return;
    }
    
    // Check if Firebase is connected
    if (!isFirebaseConnected) {
        alert('Not connected to Firebase. Please refresh and try again.');
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
                        console.log('Game state synced, starting round for host');
                        // Only the host starts the game locally, others will receive via gameState
                        startRound(1);
                    } catch (error) {
                        console.error('Failed to sync game state, starting offline:', error);
                        // Fall back to offline mode
                        isOnlineMode = false;
                        startRound(1);
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
    currentRelationshipType = gameState.relationshipType;
    currentRound = gameState.currentRound;
    currentPlayer = gameState.currentPlayer;
    roundTurns = gameState.roundTurns;
    console.log(`receiveGameState updated local state - Round: ${currentRound}, Player: ${currentPlayer}, Turns: ${roundTurns}`);
    player1Name = gameState.player1Name;
    player2Name = gameState.player2Name;
    
    // Start the game if it hasn't started yet and we're not already in a game
    if (gameState.gameStarted && !document.getElementById('game-screen').classList.contains('active')) {
        startRound(currentRound);
    } else if (gameState.gameStarted) {
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
        console.log(`Switched to player ${currentPlayer}`);
        
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



