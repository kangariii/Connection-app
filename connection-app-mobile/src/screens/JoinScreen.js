import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { joinRoom, getDatabase } from '../config/firebase';

export default function JoinScreen({ onJoin, onBack }) {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const code = roomCode.trim().toUpperCase();

    if (!code) {
      Alert.alert('Error', 'Please enter a room code');
      return;
    }

    console.log('🔵 Attempting to join room:', code);
    setLoading(true);

    try {
      const playerId = 'player-' + Math.random().toString(36).substring(2, 9);
      console.log('🔵 Generated player ID:', playerId);

      // Check if room exists
      const database = getDatabase();
      console.log('🔵 Got database instance');

      const roomRef = database.ref(`rooms/${code}`);
      console.log('🔵 Checking if room exists...');

      const snapshot = await roomRef.once('value');
      console.log('🔵 Got snapshot');

      if (!snapshot.exists()) {
        console.log('❌ Room does not exist');
        Alert.alert('Room Not Found', `The room code "${code}" does not exist. Please check and try again.`);
        setLoading(false);
        return;
      }

      const roomData = snapshot.val();
      console.log('✅ Room found:', JSON.stringify(roomData, null, 2));

      // Check if room is full
      if (roomData.players && Object.keys(roomData.players).length >= 2) {
        console.log('❌ Room is full');
        Alert.alert('Room Full', 'This room already has 2 players.');
        setLoading(false);
        return;
      }

      // Join the room
      console.log('🔵 Joining room...');
      await joinRoom(code, playerId);
      console.log('✅ Successfully joined room');

      // Navigate to lobby with playerId
      console.log('🔵 Navigating to lobby with code:', code, 'playerId:', playerId);
      onJoin(code, playerId);
      console.log('✅ Navigation triggered');
    } catch (error) {
      console.error('❌ Error joining room:', error);
      console.error('Error stack:', error.stack);
      Alert.alert('Join Failed', `Could not join room: ${error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Join Game</Text>
      <Text style={styles.subtitle}>Enter the game code shared by the host</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter game code (e.g. APPLE)"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={roomCode}
        onChangeText={(text) => setRoomCode(text.toUpperCase())}
        autoCapitalize="characters"
        maxLength={10}
      />

      <TouchableOpacity
        style={[styles.joinButton, (!roomCode || loading) && styles.joinButtonDisabled]}
        onPress={handleJoin}
        disabled={!roomCode || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.joinButtonText}>Join Game</Text>
        )}
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
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#6c63ff',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  joinButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: 'rgba(108, 99, 255, 0.3)',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
