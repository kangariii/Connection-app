import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { compatibilityQuestions, calculateCompatibilityScore } from '../data/compatibilityQuestions';
import { getDatabase } from '../config/firebase';

const database = getDatabase();

export default function CompatibilityScreen({ player1Name, player2Name, onComplete, roomCode, playerId, playerNumber }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [player1Answers, setPlayer1Answers] = useState([]);
  const [player2Answers, setPlayer2Answers] = useState([]);
  const [rankedOptions, setRankedOptions] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState(null); // Store Firebase data for comparison
  const [showWaiting, setShowWaiting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const isOnlineMode = !!roomCode;

  useEffect(() => {
    console.log('🎮 CompatibilityScreen effect for Q', currentQuestion, { roomCode, playerId, playerNumber });

    // Initialize with current question's options
    if (currentQuestion < compatibilityQuestions.length) {
      setRankedOptions([...compatibilityQuestions[currentQuestion].options]);
    }

    // Setup Firebase listeners if online
    if (isOnlineMode && currentQuestion < compatibilityQuestions.length) {
      console.log('📡 Setting up compatibility listener for Q', currentQuestion);

      const listenerRef = database.ref(`rooms/${roomCode}/compatibility/${currentQuestion}`);

      const handleDataUpdate = (snapshot) => {
        const data = snapshot.val();
        console.log('📡 Compatibility data updated for Q', currentQuestion, ':', data);

        if (!data) {
          console.log('   No data yet');
          return;
        }

        // Store the other player's answer if available
        if (playerNumber === 1 && data.player2Answer) {
          console.log('📥 Player 1 received Player 2 answer');
          setPlayer2Answers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQuestion] = data.player2Answer;
            return newAnswers;
          });
        } else if (playerNumber === 2 && data.player1Answer) {
          console.log('📥 Player 2 received Player 1 answer');
          setPlayer1Answers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQuestion] = data.player1Answer;
            return newAnswers;
          });
        }

        // If both players have answered, show comparison
        if (data.player1Answer && data.player2Answer) {
          console.log('✅ Both players answered! Showing comparison...');

          // Store both answers using callbacks to ensure sync
          setPlayer1Answers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQuestion] = data.player1Answer;
            console.log('💾 Stored player1 answer:', data.player1Answer);
            return newAnswers;
          });

          setPlayer2Answers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQuestion] = data.player2Answer;
            console.log('💾 Stored player2 answer:', data.player2Answer);
            return newAnswers;
          });

          // Store comparison data and show comparison screen
          setComparisonData({
            player1Answer: data.player1Answer,
            player2Answer: data.player2Answer
          });
          setShowWaiting(false);
          setShowComparison(true);
          setIsProcessing(false);
        } else {
          console.log('⏳ Waiting for other player...', {
            hasPlayer1Answer: !!data.player1Answer,
            hasPlayer2Answer: !!data.player2Answer
          });
        }
      };

      listenerRef.on('value', handleDataUpdate);

      return () => {
        // Cleanup listener when question changes or unmounting
        console.log('🧹 Cleaning up listener for Q', currentQuestion);
        listenerRef.off('value', handleDataUpdate);
      };
    }
  }, [currentQuestion, roomCode, playerNumber]);

  const moveOption = (fromIndex, toIndex) => {
    console.log(`🔄 Moving item from ${fromIndex} to ${toIndex}`);
    const newRanked = [...rankedOptions];
    const [removed] = newRanked.splice(fromIndex, 1);
    newRanked.splice(toIndex, 0, removed);
    setRankedOptions(newRanked);
  };

  const handleItemTap = (index) => {
    if (selectedIndex === null) {
      // First tap - select this item
      console.log('🎯 Selected item at index:', index);
      setSelectedIndex(index);
    } else {
      // Second tap - swap with selected item
      console.log(`🔄 Swapping ${selectedIndex} with ${index}`);
      moveOption(selectedIndex, index);
      setSelectedIndex(null);
    }
  };

  const submitRanking = async () => {
    const ranking = {};
    rankedOptions.forEach((option, index) => {
      ranking[option.id] = index + 1;
    });

    console.log('✅ Submitting ranking:', ranking);

    // Store answer locally
    if (playerNumber === 1) {
      const newAnswers = [...player1Answers];
      newAnswers[currentQuestion] = ranking;
      setPlayer1Answers(newAnswers);
    } else {
      const newAnswers = [...player2Answers];
      newAnswers[currentQuestion] = ranking;
      setPlayer2Answers(newAnswers);
    }

    if (isOnlineMode) {
      // Sync answer to Firebase
      try {
        const answerKey = playerNumber === 1 ? 'player1Answer' : 'player2Answer';
        await database.ref(`rooms/${roomCode}/compatibility/${currentQuestion}`).update({
          [answerKey]: ranking,
          timestamp: Date.now()
        });
        console.log('✅ Answer synced to Firebase');

        // Show waiting state
        setShowWaiting(true);
      } catch (error) {
        console.error('❌ Failed to sync answer:', error);
      }
    } else {
      // Offline mode - show comparison immediately
      setShowComparison(true);
    }
  };

  const continueToNext = async () => {
    console.log('🚀 Continue clicked by player', playerNumber);

    if (isOnlineMode) {
      // Mark this player as ready to continue
      const readyKey = playerNumber === 1 ? 'player1ReadyToContinue' : 'player2ReadyToContinue';

      try {
        await database.ref(`rooms/${roomCode}/compatibility/${currentQuestion}`).update({
          [readyKey]: true
        });
        console.log('✅ Marked as ready to continue');

        // Check if both players are ready
        const snapshot = await database.ref(`rooms/${roomCode}/compatibility/${currentQuestion}`).once('value');
        const data = snapshot.val();

        if (data && data.player1ReadyToContinue && data.player2ReadyToContinue) {
          // Both ready, advance immediately
          console.log('✅ Both players ready! Advancing...');
          advanceToNextQuestion();
        } else {
          // Wait for other player
          console.log('⏳ Waiting for other player to continue...');
          setShowWaiting(true);

          // Listen for other player's ready status
          const continueListener = database.ref(`rooms/${roomCode}/compatibility/${currentQuestion}`).on('value', (snapshot) => {
            const data = snapshot.val();

            if (data && data.player1ReadyToContinue && data.player2ReadyToContinue) {
              console.log('✅ Other player ready! Advancing...');
              database.ref(`rooms/${roomCode}/compatibility/${currentQuestion}`).off('value', continueListener);
              advanceToNextQuestion();
            }
          });
        }
      } catch (error) {
        console.error('❌ Error marking as ready:', error);
      }
    } else {
      // Offline mode - advance immediately
      advanceToNextQuestion();
    }
  };

  const advanceToNextQuestion = () => {
    console.log('🚀 Advancing to next question');

    setShowComparison(false);
    setShowWaiting(false);
    setIsProcessing(false);
    setComparisonData(null); // Reset comparison data

    if (currentQuestion + 1 >= compatibilityQuestions.length) {
      // All questions complete - pass answers to results
      onComplete({ player1Answers, player2Answers });
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateQuestionMatch = () => {
    const ranking1 = player1Answers[currentQuestion];
    const ranking2 = player2Answers[currentQuestion];

    if (!ranking1 || !ranking2) return 0;

    let totalPoints = 0;
    let maxPoints = 0;

    compatibilityQuestions[currentQuestion].options.forEach(option => {
      const rank1 = ranking1[option.id];
      const rank2 = ranking2[option.id];
      const difference = Math.abs(rank1 - rank2);
      const points = 3 - difference;
      totalPoints += points;
      maxPoints += 3;
    });

    return Math.round((totalPoints / maxPoints) * 100);
  };

  if (showComparison) {
    const question = compatibilityQuestions[currentQuestion];

    // Use comparisonData if available, otherwise fall back to state
    const ranking1 = comparisonData ? comparisonData.player1Answer : player1Answers[currentQuestion];
    const ranking2 = comparisonData ? comparisonData.player2Answer : player2Answers[currentQuestion];

    // Safety check - both rankings must exist
    if (!ranking1 || !ranking2) {
      console.log('⚠️ Missing rankings, waiting...', { ranking1, ranking2, comparisonData });
      return (
        <View style={styles.container}>
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>⏳</Text>
            <Text style={styles.waitingTitle}>Loading comparison...</Text>
          </View>
        </View>
      );
    }

    // Calculate match percentage using the rankings we have
    let totalPoints = 0;
    let maxPoints = 0;
    question.options.forEach(option => {
      const rank1 = ranking1[option.id];
      const rank2 = ranking2[option.id];
      const difference = Math.abs(rank1 - rank2);
      const points = 3 - difference;
      totalPoints += points;
      maxPoints += 3;
    });
    const matchPercentage = Math.round((totalPoints / maxPoints) * 100);

    // Sort options by player 1's ranking for display
    const sortedByPlayer1 = [...question.options].sort((a, b) => ranking1[a.id] - ranking1[b.id]);
    const sortedByPlayer2 = [...question.options].sort((a, b) => ranking2[a.id] - ranking2[b.id]);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>How You Compared</Text>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.matchBadge}>
          <Text style={styles.matchPercentage}>{matchPercentage}%</Text>
          <Text style={styles.matchLabel}>Match on this question</Text>
        </View>

        <View style={styles.comparisonContainer}>
          <View style={styles.playerColumn}>
            <Text style={styles.playerName}>{player1Name}</Text>
            {sortedByPlayer1.map((option) => {
              const rank = ranking1[option.id];
              return (
                <View key={option.id} style={styles.rankItem}>
                  <Text style={styles.rankNumber}>{rank}</Text>
                  <Text style={styles.rankText}>{option.text}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.playerColumn}>
            <Text style={styles.playerName}>{player2Name}</Text>
            {sortedByPlayer2.map((option) => {
              const rank = ranking2[option.id];
              return (
                <View key={option.id} style={styles.rankItem}>
                  <Text style={styles.rankNumber}>{rank}</Text>
                  <Text style={styles.rankText}>{option.text}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={continueToNext}>
          <Text style={styles.continueButtonText}>
            {currentQuestion + 1 >= compatibilityQuestions.length ? 'See Final Results' : 'Continue to Next Question'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Waiting state
  if (showWaiting) {
    return (
      <View style={styles.container}>
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>⏳</Text>
          <Text style={styles.waitingTitle}>Waiting for other player...</Text>
          <Text style={styles.waitingSubtitle}>They're reviewing their answer</Text>
        </View>
      </View>
    );
  }

  if (currentQuestion >= compatibilityQuestions.length) {
    return null;
  }

  const question = compatibilityQuestions[currentQuestion];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / compatibilityQuestions.length) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {compatibilityQuestions.length}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.questionText}>{question.question}</Text>
        <Text style={styles.instruction}>
          Tap an item to select it, then tap another to swap positions. Most important at top.
        </Text>

        <View style={styles.rankingList}>
          {rankedOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={styles.draggableItem}
              onPress={() => handleItemTap(index)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.rankingItem,
                selectedIndex === index && styles.rankingItemSelected
              ]}>
                <Text style={styles.rankNumberBadge}>{index + 1}</Text>
                <Text style={styles.optionText}>{option.text}</Text>
                {selectedIndex === index && <Text style={styles.selectedIndicator}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submitRanking}>
          <Text style={styles.submitButtonText}>Submit Ranking</Text>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  playerTurn: {
    fontSize: 18,
    color: '#6c63ff',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 28,
  },
  instruction: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 25,
    textAlign: 'center',
  },
  rankingList: {
    marginBottom: 20,
  },
  draggableItem: {
    marginBottom: 15,
  },
  rankingItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rankingItemSelected: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    borderColor: '#6c63ff',
    borderWidth: 2,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rankNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6c63ff',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '700',
    marginRight: 12,
    fontSize: 16,
  },
  optionText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
  },
  selectedIndicator: {
    color: '#6c63ff',
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 10,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  waitingText: {
    fontSize: 64,
    marginBottom: 20,
  },
  waitingTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  waitingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  matchBadge: {
    alignItems: 'center',
    marginVertical: 25,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  matchPercentage: {
    fontSize: 56,
    fontWeight: '700',
    color: '#6c63ff',
  },
  matchLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 20,
  },
  playerColumn: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c63ff',
    marginBottom: 12,
    textAlign: 'center',
  },
  rankItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rankNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#6c63ff',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
    marginRight: 10,
    fontSize: 13,
  },
  rankText: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    lineHeight: 16,
  },
  continueButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
