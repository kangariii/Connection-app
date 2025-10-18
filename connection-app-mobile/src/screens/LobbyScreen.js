import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { generateRoomCode, createRoom, listenToRoom, updatePlayer } from '../config/firebase';

export default function LobbyScreen({ gameMode, relationshipType, onStartGame, isHost, roomCode: initialRoomCode, joinedPlayerId }) {
  const [yourName, setYourName] = useState('');
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [playerId] = useState(() => {
    // Use the playerId from joining, or generate a new one for host
    if (joinedPlayerId) {
      console.log('🔑 Using joinedPlayerId:', joinedPlayerId);
      return joinedPlayerId;
    }
    const newId = 'player-' + Math.random().toString(36).substring(2, 9);
    console.log('🔑 Generated new playerId:', newId);
    return newId;
  });
  const [playerNumber] = useState(isHost ? 1 : 2);
  const [roomData, setRoomData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🎲 LobbyScreen mounted with playerId:', playerId, 'isHost:', isHost, 'playerNumber:', playerNumber);
  }, []);

  useEffect(() => {
    if (isHost && !roomCode) {
      // Generate room code for host
      const code = generateRoomCode();
      console.log('🎮 Host creating room with code:', code);
      setRoomCode(code);

      // Create room in Firebase
      createRoom(code, playerId, gameMode)
        .then(() => console.log('✅ Room created successfully'))
        .catch(err => {
          console.error('❌ Error creating room:', err);
        });
    }
  }, [isHost]);

  useEffect(() => {
    if (!roomCode) return;

    console.log('👂 Listening to room:', roomCode);

    // Listen to room updates
    const unsubscribe = listenToRoom(roomCode, (data) => {
      console.log('📡 Room data updated:', JSON.stringify(data, null, 2));
      setRoomData(data);

      if (data && data.players) {
        const allPlayers = Object.values(data.players);

        // Only count players with valid playerNumbers (1 or 2)
        const validPlayers = allPlayers.filter(p => p.playerNumber === 1 || p.playerNumber === 2);
        const readyPlayers = validPlayers.filter(p => p.connected && p.ready && p.name);

        console.log(`👥 Total in DB: ${allPlayers.length}, Valid Players: ${validPlayers.length}, Ready: ${readyPlayers.length}`);

        // Find player 1 and player 2
        const p1 = validPlayers.find(p => p.playerNumber === 1);
        const p2 = validPlayers.find(p => p.playerNumber === 2);

        // If both players are ready, start the game
        if (p1 && p2 && p1.ready && p2.ready && p1.name && p2.name) {
          console.log('✅ Both players ready! Starting game...');
          console.log(`🎮 Starting game with ${p1.name} and ${p2.name}`);
          // Small delay to ensure Firebase sync
          setTimeout(() => {
            onStartGame(p1.name, p2.name, playerNumber);
          }, 500);
        } else {
          if (p1) console.log('Player 1:', p1.name || 'no name', 'ready:', p1.ready);
          if (p2) console.log('Player 2:', p2.name || 'no name', 'ready:', p2.ready);
        }
      }
    });

    return () => {
      console.log('🔌 Unsubscribing from room:', roomCode);
      unsubscribe && unsubscribe();
    };
  }, [roomCode]);

  const handleReady = async () => {
    if (!yourName.trim()) {
      alert('Please enter your name');
      return;
    }

    console.log('✋ Player marking ready:', yourName);
    setLoading(true);

    try {
      // Update player info
      console.log('📝 Updating player info in Firebase...');
      await updatePlayer(roomCode, playerId, {
        name: yourName,
        ready: true
      });

      console.log('✅ Player marked as ready');
      setIsReady(true);
    } catch (error) {
      console.error('❌ Error marking ready:', error);
      alert('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = () => {
    if (!roomData || !roomData.players) return 'Connecting...';

    const players = Object.values(roomData.players);
    const connectedCount = players.filter(p => p.connected).length;

    if (connectedCount < 2) {
      return 'Waiting for partner to join...';
    }

    const readyCount = players.filter(p => p.ready).length;
    if (readyCount < 2) {
      return 'Waiting for both players to be ready...';
    }

    return 'Starting game...';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Lobby</Text>

      {roomCode && (
        <View style={styles.roomCodeContainer}>
          <Text style={styles.roomCodeLabel}>Room Code</Text>
          <Text style={styles.roomCode}>{roomCode}</Text>
          <Text style={styles.roomCodeHint}>Share this code with your partner</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={yourName}
          onChangeText={setYourName}
          editable={!isReady}
        />
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <TouchableOpacity
        style={[styles.startButton, (!yourName || isReady || loading) && styles.startButtonDisabled]}
        onPress={handleReady}
        disabled={!yourName || isReady || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.startButtonText}>
            {isReady ? 'Ready!' : 'I\'m Ready'}
          </Text>
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  roomCodeContainer: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6c63ff',
  },
  roomCodeLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  roomCode: {
    fontSize: 36,
    fontWeight: '700',
    color: '#6c63ff',
    letterSpacing: 4,
    marginBottom: 8,
  },
  roomCodeHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(108, 99, 255, 0.3)',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
