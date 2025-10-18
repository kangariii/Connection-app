import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function KnowledgeResultsScreen({ onRestart }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Complete!</Text>
      <Text style={styles.score}>Player 1: 8</Text>
      <Text style={styles.score}>Player 2: 7</Text>
      <Text style={styles.winner}>Player 1 Wins!</Text>

      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 40,
  },
  score: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  winner: {
    fontSize: 28,
    color: '#6c63ff',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#6c63ff',
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
