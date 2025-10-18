import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

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

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

// Helper function to generate room code
export function generateRoomCode() {
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

// Create a new room
export async function createRoom(roomCode, hostPlayerId, gameMode) {
  const roomRef = database.ref(`rooms/${roomCode}`);

  await roomRef.set({
    hostPlayerId: hostPlayerId,
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
      currentQuestion: 0,
      gameStarted: false
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP
  });
}

// Join an existing room
export async function joinRoom(roomCode, playerId) {
  const playerRef = database.ref(`rooms/${roomCode}/players/${playerId}`);

  await playerRef.set({
    playerNumber: 2,
    name: '',
    connected: true,
    ready: false,
    joinedAt: firebase.database.ServerValue.TIMESTAMP
  });
}

// Update player info
export async function updatePlayer(roomCode, playerId, data) {
  const playerRef = database.ref(`rooms/${roomCode}/players/${playerId}`);
  await playerRef.update(data);
}

// Listen to room changes
export function listenToRoom(roomCode, callback) {
  const roomRef = database.ref(`rooms/${roomCode}`);
  const listener = roomRef.on('value', (snapshot) => {
    callback(snapshot.val());
  });

  // Return unsubscribe function
  return () => roomRef.off('value', listener);
}

// Update game state
export async function updateGameState(roomCode, gameState) {
  const gameStateRef = database.ref(`rooms/${roomCode}/gameState`);
  await gameStateRef.update(gameState);
}

// Sync compatibility answer
export async function syncCompatibilityAnswer(roomCode, questionIndex, playerNumber, answer) {
  const answerKey = playerNumber === 1 ? 'player1Answer' : 'player2Answer';
  const answerRef = database.ref(`rooms/${roomCode}/compatibility/${questionIndex}`);

  await answerRef.update({
    [answerKey]: answer,
    [`${answerKey}Timestamp`]: Date.now()
  });
}

// Listen to compatibility question
export function listenToCompatibilityQuestion(roomCode, questionIndex, callback) {
  const questionRef = database.ref(`rooms/${roomCode}/compatibility/${questionIndex}`);
  const listener = questionRef.on('value', (snapshot) => {
    callback(snapshot.val());
  });

  return () => questionRef.off('value', listener);
}

// Disconnect player
export async function disconnectPlayer(roomCode, playerId) {
  const playerRef = database.ref(`rooms/${roomCode}/players/${playerId}`);
  await playerRef.update({
    connected: false,
    ready: false
  });
}

// Get database instance
export function getDatabase() {
  return database;
}

export { database, firebase };
