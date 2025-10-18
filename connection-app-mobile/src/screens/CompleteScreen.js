import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CompleteScreen({ onRestart }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journey Complete!</Text>
      <Text style={styles.message}>You've shared meaningful moments and deepened your connection</Text>

      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Start New Journey</Text>
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
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
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
