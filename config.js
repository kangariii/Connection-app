// Firebase Configuration
// Replace with your own Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyACUakWVoy8DKhiZT-8hgsxi2l4oMldEcQ",
    authDomain: "who-are-you-a2008.firebaseapp.com",
    databaseURL: "https://who-are-you-a2008-default-rtdb.firebaseio.com",
    projectId: "who-are-you-a2008",
    storageBucket: "who-are-you-a2008.firebasestorage.app",
    messagingSenderId: "921507573285",
    appId: "1:921507573285:web:527c2e09adbba36116d9cc",
    measurementId: "G-P440Q5XDGP"
};

// Firebase Database Functions
let database = null;
let isFirebaseConnected = false;

async function initializeFirebase() {
    try {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            console.log('Firebase not available, running in offline mode');
            isFirebaseConnected = false;
            return false;
        }
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        
        // Test database connection
        await database.ref('.info/connected').once('value');
        
        isFirebaseConnected = true;
        console.log('Firebase connected successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        console.error('This might be due to database rules. Check Firebase Console > Realtime Database > Rules');
        isFirebaseConnected = false;
        return false;
    }
}

// Firebase Database helper functions
function createRoom(roomCode, hostPlayerId, relationshipType, gameMode = 'connection') {
    if (!isFirebaseConnected) return Promise.resolve();

    return database.ref(`rooms/${roomCode}`).set({
        hostPlayerId: hostPlayerId,
        relationshipType: relationshipType,
        gameMode: gameMode,
        players: {
            [hostPlayerId]: {
                playerNumber: 1,
                name: '',
                connected: true,
                ready: false,
                joinedAt: firebase.database.ServerValue.TIMESTAMP
            }
        },
        gameState: {
            currentRound: 1,
            currentPlayer: 1,
            roundTurns: 0,
            gameStarted: false
        },
        createdAt: firebase.database.ServerValue.TIMESTAMP
    });
}

function joinRoom(roomCode, playerId, playerName) {
    if (!isFirebaseConnected) return Promise.resolve();
    
    return database.ref(`rooms/${roomCode}/players/${playerId}`).set({
        playerNumber: 2,
        name: playerName,
        connected: true,
        ready: false,
        joinedAt: firebase.database.ServerValue.TIMESTAMP
    });
}

function updateGameState(roomCode, gameState) {
    if (!isFirebaseConnected) return Promise.resolve();
    
    return database.ref(`rooms/${roomCode}/gameState`).update(gameState);
}

function sendMessage(roomCode, messageType, data) {
    if (!isFirebaseConnected) return Promise.resolve();
    
    const messageData = {
        type: messageType,
        data: data,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    return database.ref(`rooms/${roomCode}/messages`).push(messageData);
}

function listenToRoom(roomCode, callback) {
    if (!isFirebaseConnected) return () => {};
    
    const roomRef = database.ref(`rooms/${roomCode}`);
    roomRef.on('value', callback);
    
    // Return unsubscribe function
    return () => roomRef.off('value', callback);
}

function listenToMessages(roomCode, callback) {
    if (!isFirebaseConnected) return () => {};
    
    const messagesRef = database.ref(`rooms/${roomCode}/messages`);
    messagesRef.on('child_added', callback);
    
    // Return unsubscribe function
    return () => messagesRef.off('child_added', callback);
}

function disconnectPlayer(roomCode, playerId) {
    if (!isFirebaseConnected) return Promise.resolve();
    
    return database.ref(`rooms/${roomCode}/players/${playerId}`).update({
        connected: false,
        ready: false
    });
}

console.log('Firebase configuration loaded');