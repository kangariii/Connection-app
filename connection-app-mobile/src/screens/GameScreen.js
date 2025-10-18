import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { questionsDatabase, getRandomQuestion } from '../data/questionsDatabase';
import { getDatabase } from '../config/firebase';

const database = getDatabase();

// Round configurations matching web app
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

export default function GameScreen({
  player1Name,
  player2Name,
  relationshipType,
  onComplete,
  roomCode,
  playerId,
  playerNumber
}) {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [roundTurns, setRoundTurns] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementType, setAnnouncementType] = useState('title');
  const [isUpdatingState, setIsUpdatingState] = useState(false);

  const isOnlineMode = !!roomCode;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('🎮 GameScreen mounted with:', {
      player1Name, player2Name, relationshipType, roomCode, playerId, playerNumber
    });

    // Start first round with announcements
    startRound(1);

    // Setup Firebase listeners if online
    if (isOnlineMode) {
      setupGameStateListener();
    }

    return () => {
      // Cleanup listeners
      if (isOnlineMode) {
        database.ref(`rooms/${roomCode}/gameState`).off();
      }
    };
  }, []);

  const setupGameStateListener = () => {
    console.log('📡 Setting up game state listener for room:', roomCode);

    database.ref(`rooms/${roomCode}/gameState`).on('value', (snapshot) => {
      const gameState = snapshot.val();
      console.log('📡 Game state updated:', gameState);

      if (gameState && gameState.gameStarted) {
        receiveGameState(gameState);
      }
    });
  };

  const receiveGameState = (gameState) => {
    console.log(`📡 Receiving game state - Round: ${gameState.currentRound}, Player: ${gameState.currentPlayer}, Turns: ${gameState.roundTurns}`);

    const oldRound = currentRound;

    setCurrentRound(gameState.currentRound);
    setCurrentPlayer(gameState.currentPlayer);
    setRoundTurns(gameState.roundTurns);

    // Check if round changed
    if (oldRound !== gameState.currentRound && gameState.currentRound > oldRound) {
      console.log(`📡 New round detected, starting round ${gameState.currentRound}`);
      startRound(gameState.currentRound);
    } else {
      // Just update display
      updateGameDisplay(gameState.currentPlayer, gameState.roundTurns);
    }
  };

  const syncGameState = async () => {
    if (!isOnlineMode) return;

    try {
      await database.ref(`rooms/${roomCode}/gameState`).update({
        currentRound,
        currentPlayer,
        roundTurns,
        gameStarted: true
      });
      console.log('✅ Game state synced to Firebase');
    } catch (error) {
      console.error('❌ Failed to sync game state:', error);
    }
  };

  const startRound = (roundNumber) => {
    console.log(`🎯 Starting Round ${roundNumber}`);

    setCurrentRound(roundNumber);
    setRoundTurns(0);
    setCurrentPlayer(1);
    setCurrentQuestion('');
    setShowCategories(false);
    setShowQuestion(false);
    setShowRoundComplete(false);

    const roundConfig = roundConfigs[roundNumber];

    // Show announcement sequence
    const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
    showSequentialMessages([
      { text: `Round ${roundNumber}`, type: 'title', duration: 2000 },
      { text: roundConfig.subtitle, type: 'subtitle', duration: 2500 },
      { text: `${currentPlayerName}'s turn`, type: 'message', duration: 2000 }
    ], () => {
      // After announcements, show game UI
      updateGameDisplay(1, 0);
    });
  };

  const showSequentialMessages = (messages, callback) => {
    let currentIndex = 0;

    const showNext = () => {
      if (currentIndex >= messages.length) {
        if (callback) callback();
        return;
      }

      const message = messages[currentIndex];
      showMessage(message.text, message.type, message.duration, () => {
        currentIndex++;
        setTimeout(showNext, 300);
      });
    };

    showNext();
  };

  const showMessage = (text, type, duration, callback) => {
    setAnnouncementText(text);
    setAnnouncementType(type);
    setShowAnnouncement(true);

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true
    }).start();

    // Fade out after duration
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      }).start(() => {
        setShowAnnouncement(false);
        if (callback) callback();
      });
    }, duration);
  };

  const updateGameDisplay = (player, turns) => {
    console.log(`🎨 Updating display - Player: ${player}, Turns: ${turns}, PlayerNumber: ${playerNumber}`);

    // Check if round is complete
    if (turns >= 2) {
      console.log('✅ Round complete');
      setShowCategories(false);
      setShowQuestion(false);
      setShowRoundComplete(true);
      return;
    }

    const isMyTurn = (playerNumber === player);
    console.log(`🎨 Is my turn: ${isMyTurn}`);

    if (isMyTurn) {
      // Show category selection if question not displayed
      if (!showQuestion) {
        setShowCategories(true);
        setShowQuestion(false);
      }
    } else {
      // Show waiting state
      setShowCategories(false);
      setShowQuestion(false);
    }
  };

  const selectCategory = (category) => {
    console.log(`🎯 Category selected: ${category}`);

    // Validate it's this player's turn
    if (isOnlineMode && playerNumber !== currentPlayer) {
      alert(`It's not your turn! Wait for Player ${currentPlayer} to finish.`);
      return;
    }

    // Get random question
    const question = getRandomQuestion(category, relationshipType, currentRound);

    if (question) {
      setSelectedCategory(category);
      setCurrentQuestion(question);
      setShowCategories(false);

      // Small delay then show question
      setTimeout(() => {
        setShowQuestion(true);
      }, 300);
    } else {
      alert(`No questions available for ${category}. Please try another category.`);
    }
  };

  const nextTurn = async () => {
    console.log(`➡️ Next turn called - Turns: ${roundTurns}`);

    if (!currentQuestion) {
      alert('Please select a category and answer a question before continuing.');
      return;
    }

    if (isOnlineMode && isUpdatingState) {
      console.log('⏳ State update in progress, ignoring call');
      return;
    }

    setIsUpdatingState(true);

    const newTurns = roundTurns + 1;
    setRoundTurns(newTurns);

    if (newTurns >= 2) {
      // Round complete
      console.log('✅ Round complete - showing round complete UI');
      setShowQuestion(false);
      setShowRoundComplete(true);
      setCurrentQuestion('');

      if (isOnlineMode) {
        await syncGameState();
      }
      setIsUpdatingState(false);
    } else {
      // Switch to other player
      const newPlayer = currentPlayer === 1 ? 2 : 1;
      setCurrentPlayer(newPlayer);
      setCurrentQuestion('');
      setShowQuestion(false);

      if (isOnlineMode) {
        await syncGameState();
        setIsUpdatingState(false);
      } else {
        // Offline mode - show turn transition
        const newPlayerName = newPlayer === 1 ? player1Name : player2Name;
        showMessage(`${newPlayerName}'s turn`, 'message', 1500, () => {
          setShowCategories(true);
          setIsUpdatingState(false);
        });
      }
    }
  };

  const nextRound = async () => {
    console.log(`➡️ Next round - Current: ${currentRound}`);

    setShowRoundComplete(false);

    if (currentRound >= 5) {
      // Game complete
      onComplete();
    } else {
      const newRound = currentRound + 1;
      setCurrentRound(newRound);
      setRoundTurns(0);
      setCurrentPlayer(1);
      setCurrentQuestion('');

      if (isOnlineMode) {
        await syncGameState();
      }

      startRound(newRound);
    }
  };

  const roundConfig = roundConfigs[currentRound];
  const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
  const otherPlayerName = currentPlayer === 1 ? player2Name : player1Name;
  const isMyTurn = !isOnlineMode || (playerNumber === currentPlayer);

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentRound / 5) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>Round {currentRound} of 5</Text>
      </View>

      {/* Announcement Overlay */}
      {showAnnouncement && (
        <Animated.View style={[styles.announcementOverlay, { opacity: fadeAnim }]}>
          <View style={styles.announcementContent}>
            <Text style={
              announcementType === 'title' ? styles.announcementTitle :
              announcementType === 'subtitle' ? styles.announcementSubtitle :
              styles.announcementMessage
            }>
              {announcementText}
            </Text>
          </View>
        </Animated.View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Turn Info */}
        {!showRoundComplete && !showAnnouncement && (
          <Text style={styles.turnInfo}>
            {isMyTurn
              ? `Your turn to choose and ask ${otherPlayerName}`
              : `${currentPlayerName} is choosing a question to ask you`
            }
          </Text>
        )}

        {/* Category Selection */}
        {showCategories && isMyTurn && !showRoundComplete && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Choose a category:</Text>
            {roundConfig.categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryButton}
                onPress={() => selectCategory(category)}
              >
                <Text style={styles.categoryButtonText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Waiting State */}
        {!showCategories && !showQuestion && !showRoundComplete && !isMyTurn && !showAnnouncement && (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingTitle}>Waiting...</Text>
            <Text style={styles.waitingMessage}>
              {currentPlayerName} is choosing a question to ask you. Get ready to share and listen!
            </Text>
            <View style={styles.waitingDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        )}

        {/* Question Display */}
        {showQuestion && (
          <View style={styles.questionContainer}>
            <Text style={styles.categoryBadge}>{selectedCategory}</Text>
            <Text style={styles.questionText}>{currentQuestion}</Text>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Take turns sharing your answers and discussing them together.
              </Text>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={nextTurn}>
              <Text style={styles.nextButtonText}>
                {roundTurns + 1 >= 2 ? 'Complete Round' : 'Next Turn'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Round Complete */}
        {showRoundComplete && (
          <View style={styles.roundCompleteContainer}>
            <Text style={styles.roundCompleteTitle}>
              Round {currentRound} Complete! 🎉
            </Text>
            <Text style={styles.roundCompleteMessage}>
              Great job sharing and listening!
            </Text>

            <TouchableOpacity style={styles.nextRoundButton} onPress={nextRound}>
              <Text style={styles.nextRoundButtonText}>
                {currentRound >= 5 ? 'Complete Journey' : 'Continue to Next Round'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6c63ff',
  },
  progressText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  announcementOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  announcementContent: {
    padding: 40,
  },
  announcementTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  announcementSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  announcementMessage: {
    fontSize: 28,
    fontWeight: '600',
    color: '#6c63ff',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  turnInfo: {
    fontSize: 16,
    color: '#6c63ff',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '600',
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryButton: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#6c63ff',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  waitingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  waitingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
  },
  waitingMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  waitingDots: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6c63ff',
  },
  questionContainer: {
    marginTop: 20,
  },
  categoryBadge: {
    fontSize: 14,
    color: '#6c63ff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 32,
  },
  instructionContainer: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  instructionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  roundCompleteContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  roundCompleteTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  roundCompleteMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 30,
  },
  nextRoundButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 12,
    padding: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  nextRoundButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
