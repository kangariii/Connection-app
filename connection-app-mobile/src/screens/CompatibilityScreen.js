import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { compatibilityQuestions, calculateCompatibilityScore } from '../data/compatibilityQuestions';

export default function CompatibilityScreen({ player1Name, player2Name, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [player1Answers, setPlayer1Answers] = useState([]);
  const [player2Answers, setPlayer2Answers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [rankedOptions, setRankedOptions] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    // Initialize with current question's options
    if (currentQuestion < compatibilityQuestions.length) {
      setRankedOptions([...compatibilityQuestions[currentQuestion].options]);
    }
  }, [currentQuestion]);

  const moveOption = (fromIndex, toIndex) => {
    const newRanked = [...rankedOptions];
    const [removed] = newRanked.splice(fromIndex, 1);
    newRanked.splice(toIndex, 0, removed);
    setRankedOptions(newRanked);
  };

  const submitRanking = () => {
    const ranking = {};
    rankedOptions.forEach((option, index) => {
      ranking[option.id] = index + 1;
    });

    if (currentPlayer === 1) {
      const newAnswers = [...player1Answers];
      newAnswers[currentQuestion] = ranking;
      setPlayer1Answers(newAnswers);
      setCurrentPlayer(2);
      // Reset for player 2
      setRankedOptions([...compatibilityQuestions[currentQuestion].options]);
    } else {
      const newAnswers = [...player2Answers];
      newAnswers[currentQuestion] = ranking;
      setPlayer2Answers(newAnswers);

      // Show comparison
      setShowComparison(true);
    }
  };

  const continueToNext = () => {
    setShowComparison(false);

    if (currentQuestion + 1 >= compatibilityQuestions.length) {
      // All questions complete - pass answers to results
      onComplete({ player1Answers, player2Answers });
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentPlayer(1);
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
    const matchPercentage = calculateQuestionMatch();
    const question = compatibilityQuestions[currentQuestion];
    const ranking1 = player1Answers[currentQuestion];
    const ranking2 = player2Answers[currentQuestion];

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

  if (currentQuestion >= compatibilityQuestions.length) {
    return null;
  }

  const question = compatibilityQuestions[currentQuestion];
  const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;

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
        <Text style={styles.playerTurn}>{currentPlayerName}'s turn</Text>
        <Text style={styles.questionText}>{question.question}</Text>
        <Text style={styles.instruction}>Use arrows to reorder from most important (top) to least important (bottom)</Text>

        <View style={styles.rankingList}>
          {rankedOptions.map((option, index) => (
            <View key={option.id} style={styles.draggableItem}>
              <View style={styles.rankingItem}>
                <Text style={styles.rankNumberBadge}>{index + 1}</Text>
                <Text style={styles.optionText}>{option.text}</Text>
              </View>
              <View style={styles.moveButtons}>
                <TouchableOpacity
                  style={[styles.moveButton, index === 0 && styles.moveButtonDisabled]}
                  onPress={() => index > 0 && moveOption(index, index - 1)}
                  disabled={index === 0}
                >
                  <Text style={styles.moveButtonText}>↑</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.moveButton, index === rankedOptions.length - 1 && styles.moveButtonDisabled]}
                  onPress={() => index < rankedOptions.length - 1 && moveOption(index, index + 1)}
                  disabled={index === rankedOptions.length - 1}
                >
                  <Text style={styles.moveButtonText}>↓</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  moveButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 10,
  },
  moveButton: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6c63ff',
    minWidth: 50,
  },
  moveButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    opacity: 0.3,
  },
  moveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
