import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { calculateCompatibilityScore } from '../data/compatibilityQuestions';

export default function CompatibilityResultsScreen({ results, onRestart }) {
  // Calculate the final score from the answers
  const { player1Answers = [], player2Answers = [] } = results || {};

  const scoreData = calculateCompatibilityScore(player1Answers, player2Answers);
  const { score, insights, breakdown } = scoreData;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Compatibility Results</Text>

      <View style={styles.scoreCircle}>
        <Text style={styles.score}>{score}%</Text>
      </View>

      <Text style={styles.rating}>{insights.rating}</Text>
      <Text style={styles.message}>{insights.message}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compatibility Breakdown</Text>
        {breakdown.map((item, index) => (
          <View key={index} style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.category}</Text>
            <View style={styles.scoreBarContainer}>
              <View style={[styles.scoreBar, { width: `${item.matchPercentage}%` }]} />
            </View>
            <Text style={styles.categoryScore}>{item.matchPercentage}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights & Growth</Text>

        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Strengths</Text>
          <Text style={styles.insightText}>{insights.strengths}</Text>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Growth Areas</Text>
          <Text style={styles.insightText}>{insights.growth}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Start New Journey</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderWidth: 8,
    borderColor: '#6c63ff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
  },
  score: {
    fontSize: 60,
    fontWeight: '700',
    color: '#6c63ff',
  },
  rating: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  categoryItem: {
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  scoreBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  scoreBar: {
    height: '100%',
    backgroundColor: '#6c63ff',
  },
  categoryScore: {
    fontSize: 13,
    color: '#6c63ff',
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  insightLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c63ff',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#6c63ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
