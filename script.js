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
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Who Are You? App Initialized');
    
    // Initialize Firebase
    await initializeFirebase();
    
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

function showCreateGame() {
    showScreen('relationship-screen');
}

function showJoinGame() {
    showScreen('join-screen');
}

function selectRelationship(relationshipType) {
    currentRelationshipType = relationshipType;
    console.log('Selected relationship:', relationshipType);
    
    // Visual feedback for selection
    const relationshipBtns = document.querySelectorAll('.relationship-btn');
    relationshipBtns.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
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
        
        // Notify other player via Firebase if in online mode
        if (isOnlineMode && isFirebaseConnected) {
            sendMessage(roomCode, 'questionSelected', {
                category: category,
                question: question,
                playerId: playerId
            }).catch(error => {
                console.error('Failed to send question selection:', error);
            });
        }
    } else {
        console.error('No question found for category:', category);
        alert('Sorry, no questions available for this category. Please try another.');
    }
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
    // First increment roundTurns to track completed turns
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
    console.trace('completeRound() called from:');
    console.log(`completeRound: roundTurns=${roundTurns}, currentPlayer=${currentPlayer}, isOnlineMode=${isOnlineMode}`);
    
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
    // Clean up Firebase listeners
    if (roomListener) {
        roomListener();
        roomListener = null;
    }
    if (messagesListener) {
        messagesListener();
        messagesListener = null;
    }
    
    // Disconnect from room
    if (isOnlineMode && roomCode && playerId) {
        disconnectPlayer(roomCode, playerId);
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
    
    // Clear input fields
    document.getElementById('player1-name').value = '';
    document.getElementById('player2-name').value = '';
    document.getElementById('your-name').value = '';
    document.getElementById('room-code-input').value = '';
    
    // Hide join room input
    document.getElementById('join-room-input').classList.add('hidden');
    
    // Remove any selected relationship buttons
    const relationshipBtns = document.querySelectorAll('.relationship-btn');
    relationshipBtns.forEach(btn => btn.classList.remove('selected'));
    
    // Return to welcome screen
    showScreen('welcome-screen');
    
    console.log('Game restarted');
}

// Multiplayer Functions

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function createGameRoom() {
    isOnlineMode = true; // Set online mode
    roomCode = generateRoomCode();
    playerId = 'player-' + Math.random().toString(36).substring(2, 9);
    playerNumber = 1;
    
    document.getElementById('room-code-display').textContent = roomCode;
    document.getElementById('lobby-status').textContent = 'Creating room...';
    showScreen('lobby-screen');
    
    try {
        await createRoom(roomCode, playerId, currentRelationshipType);
        setupRoomListeners();
        document.getElementById('lobby-status').textContent = 'Room created! Share the code with your partner.';
    } catch (error) {
        console.error('Failed to create room:', error);
        document.getElementById('lobby-status').textContent = 'Failed to create room. Please try again.';
    }
}

async function joinGameRoom() {
    const inputCode = document.getElementById('room-code-input').value.trim().toUpperCase();
    if (!inputCode || inputCode.length !== 6) {
        alert('Please enter a valid 6-character game code');
        return;
    }
    
    isOnlineMode = true; // Set online mode
    roomCode = inputCode;
    playerId = 'player-' + Math.random().toString(36).substring(2, 9);
    playerNumber = 2;
    
    document.getElementById('room-code-display').textContent = roomCode;
    document.getElementById('lobby-status').textContent = 'Joining game...';
    showScreen('lobby-screen');
    
    try {
        await joinRoom(roomCode, playerId, 'Player 2');
        setupRoomListeners();
        document.getElementById('lobby-status').textContent = 'Joined game! Enter your name and click "Begin Journey" when ready.';
    } catch (error) {
        console.error('Failed to join game:', error);
        document.getElementById('lobby-status').textContent = 'Failed to join game. Please check the code and try again.';
    }
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
            // Both players are ready, start the game
            if (roomData.gameState && roomData.gameState.gameStarted) {
                receiveGameState(roomData.gameState);
            }
        } else {
            document.getElementById('lobby-status').textContent = `Waiting for ${2 - readyPlayers.length} player(s) to be ready...`;
            document.getElementById('start-online-game').disabled = false;
        }
    } else {
        document.getElementById('lobby-status').textContent = 'Waiting for other player to join...';
        document.getElementById('start-online-game').disabled = true;
    }
}

function handleFirebaseMessage(messageData) {
    switch (messageData.type) {
        case 'questionSelected':
            if (messageData.data.playerId !== playerId) {
                receiveQuestionSelection(messageData.data.category, messageData.data.question);
            }
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
                    await syncGameState();
                    // Only the host starts the game locally, others will receive via gameState
                    startRound(1);
                } else {
                    // Player 2 waits for game state update from Firebase
                    console.log('Player 2 waiting for game state from host...');
                }
                
                document.getElementById('lobby-status').textContent = 'Game starting...';
            } else {
                document.getElementById('lobby-status').textContent = 'Waiting for other player to be ready...';
                document.getElementById('start-online-game').disabled = true;
            }
        }
    } catch (error) {
        console.error('Failed to start online game:', error);
        alert('Failed to start game. Please try again.');
    }
}

async function syncGameState() {
    if (!isOnlineMode || !isFirebaseConnected) return;
    
    try {
        await updateGameState(roomCode, gameState);
        console.log('Game state synced to Firebase');
    } catch (error) {
        console.error('Failed to sync game state:', error);
    }
}

function receiveGameState(newGameState) {
    console.log(`receiveGameState called. roundTurns from Firebase: ${newGameState.roundTurns}`);
    gameState = newGameState;
    
    // Update local game variables
    currentRelationshipType = gameState.relationshipType;
    currentRound = gameState.currentRound;
    currentPlayer = gameState.currentPlayer;
    roundTurns = gameState.roundTurns;
    console.log(`receiveGameState updated local roundTurns to: ${roundTurns}`);
    player1Name = gameState.player1Name;
    player2Name = gameState.player2Name;
    
    // Start the game if it hasn't started yet and we're not already in a game
    if (gameState.gameStarted && document.getElementById('game-screen').classList.contains('active') === false) {
        startRound(currentRound);
    } else if (gameState.gameStarted) {
        // Just update the display - let nextTurn() handle round completion
        console.log('receiveGameState calling updateGameDisplay()');
        updateGameDisplay();
    }
}

function updateGameDisplay() {
    // Update round display
    const roundConfig = roundConfigs[currentRound];
    if (roundConfig) {
        document.getElementById('round-title').textContent = roundConfig.title;
        document.getElementById('round-subtitle').textContent = roundConfig.subtitle;
    }
    
    // Update turn display
    updateTurnDisplay();
    
    // Show appropriate UI based on whose turn it is
    const isMyTurn = (playerNumber === currentPlayer);
    
    if (isMyTurn) {
        // Only show categories if we're not already displaying a question
        const questionDisplay = document.getElementById('question-display');
        if (questionDisplay.classList.contains('hidden')) {
            document.getElementById('category-selection').style.display = 'block';
            displayCategories(roundConfig.categories);
        }
    } else {
        // Hide category selection if it's not my turn
        document.getElementById('category-selection').style.display = 'none';
        // Keep question display if it's showing, hide if not
        const questionDisplay = document.getElementById('question-display');
        if (questionDisplay.classList.contains('hidden')) {
            // Show waiting message or appropriate state for non-active player
        }
    }
}

function receiveQuestionSelection(category, question) {
    // Another player selected a question
    displayQuestion(category, question);
}


function nextTurn() {
    console.log(`nextTurn called: isOnlineMode=${isOnlineMode}, roundTurns before increment: ${roundTurns}`);
    
    // First increment roundTurns to track completed turns
    roundTurns++;
    console.log(`roundTurns after increment: ${roundTurns}`);
    
    if (roundTurns >= 2) {
        // Round is complete (both players have asked)
        console.log('Round complete - calling completeRound()');
        completeRound();
        
        if (isOnlineMode) {
            gameState.roundTurns = roundTurns;
            syncGameState();
        }
    } else {
        // Switch to other player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        console.log(`Switched to player ${currentPlayer}`);
        
        if (isOnlineMode) {
            gameState.currentPlayer = currentPlayer;
            gameState.roundTurns = roundTurns;
            syncGameState();
            updateGameDisplay();
        } else {
            // Update turn display for offline mode
            updateTurnDisplay();
            
            // Show category selection again
            document.getElementById('category-selection').style.display = 'block';
            document.getElementById('question-display').classList.add('hidden');
            
            // Display categories for this round again
            const roundConfig = roundConfigs[currentRound];
            displayCategories(roundConfig.categories);
        }
    }
}