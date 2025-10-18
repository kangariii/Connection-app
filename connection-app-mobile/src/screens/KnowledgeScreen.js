import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function KnowledgeScreen({ player1Name, player2Name, onComplete }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Knowledge Quiz</Text>
      <Text style={styles.subtitle}>Testing Your Knowledge</Text>
      <Text style={styles.info}>Playing: {player1Name} vs {player2Name}</Text>

      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>See Results</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#6c63ff',
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
