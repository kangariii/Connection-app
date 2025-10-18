import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CreateJoinScreen({ gameMode, onCreateGame, onJoinGame, onBack }) {
  const modeNames = {
    connection: 'Deepen Your Connection',
    compatibility: 'Compatibility Test',
    knowledge: 'How Well Do You Know Each Other?',
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Who Are You?</Text>
      <Text style={styles.subtitle}>Ready to play {modeNames[gameMode]}?</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.modeButton} onPress={onCreateGame}>
          <Text style={styles.modeButtonTitle}>Create Game</Text>
          <Text style={styles.modeButtonSubtitle}>Choose relationship type and get a game code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeButton} onPress={onJoinGame}>
          <Text style={styles.modeButtonTitle}>Join Game</Text>
          <Text style={styles.modeButtonSubtitle}>Enter a game code to join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#6c63ff',
    fontSize: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    gap: 20,
  },
  modeButton: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#6c63ff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  modeButtonTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  modeButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
