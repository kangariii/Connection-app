import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function WelcomeScreen({ onSelectMode }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Who Are You?</Text>
      <Text style={styles.subtitle}>Deepen your connection through meaningful questions</Text>
      <Text style={styles.modeTitle}>Choose your game mode to begin</Text>

      <View style={styles.modesContainer}>
        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => onSelectMode('connection')}
        >
          <Text style={styles.modeIcon}>💭</Text>
          <Text style={styles.modeCardTitle}>Deepen Your Connection</Text>
          <Text style={styles.modeDescription}>
            Journey through 5 rounds of meaningful questions that progressively deepen your bond
          </Text>
          <View style={styles.modeDetails}>
            <Text style={styles.modeTime}>⏱ 20-30 min</Text>
            <Text style={styles.modeType}>Classic Mode</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => onSelectMode('compatibility')}
        >
          <Text style={styles.modeIcon}>🧩</Text>
          <Text style={styles.modeCardTitle}>Compatibility Test</Text>
          <Text style={styles.modeDescription}>
            Discover your compatibility score through 10 science-backed questions about values, communication, and vision
          </Text>
          <View style={styles.modeDetails}>
            <Text style={styles.modeTime}>⏱ 10-15 min</Text>
            <Text style={styles.modeType}>Assessment</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => onSelectMode('knowledge')}
        >
          <Text style={styles.modeIcon}>🎯</Text>
          <Text style={styles.modeCardTitle}>How Well Do You Know Each Other?</Text>
          <Text style={styles.modeDescription}>
            Compete to predict each other's answers! Test your knowledge and discover surprising things
          </Text>
          <View style={styles.modeDetails}>
            <Text style={styles.modeTime}>⏱ 15-20 min</Text>
            <Text style={styles.modeType}>Quiz Game</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  modeTitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 30,
  },
  modesContainer: {
    gap: 20,
  },
  modeCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modeIcon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 15,
  },
  modeCardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  modeDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  modeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  modeTime: {
    fontSize: 13,
    color: '#6c63ff',
  },
  modeType: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
});
