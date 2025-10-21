import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import CreateJoinScreen from './src/screens/CreateJoinScreen';
import RelationshipScreen from './src/screens/RelationshipScreen';
import JoinScreen from './src/screens/JoinScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import GameScreen from './src/screens/GameScreen';
import CompatibilityScreen from './src/screens/CompatibilityScreen';
import CompatibilityResultsScreen from './src/screens/CompatibilityResultsScreen';
import KnowledgeScreen from './src/screens/KnowledgeScreen';
import KnowledgeResultsScreen from './src/screens/KnowledgeResultsScreen';
import CompleteScreen from './src/screens/CompleteScreen';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [gameMode, setGameMode] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [compatibilityResults, setCompatibilityResults] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinedPlayerId, setJoinedPlayerId] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(0);

  const screens = {
    splash: <SplashScreen onFinish={() => setCurrentScreen('welcome')} />,
    welcome: <WelcomeScreen onSelectMode={(mode) => {
      setGameMode(mode);
      setCurrentScreen('createJoin');
    }} />,
    createJoin: <CreateJoinScreen
      gameMode={gameMode}
      onCreateGame={() => {
        setIsHost(true);
        // Skip relationship selection for compatibility and knowledge modes
        if (gameMode === 'compatibility' || gameMode === 'knowledge') {
          setCurrentScreen('lobby');
        } else {
          setCurrentScreen('relationship');
        }
      }}
      onJoinGame={() => {
        setIsHost(false);
        setCurrentScreen('join');
      }}
      onBack={() => setCurrentScreen('welcome')}
    />,
    relationship: <RelationshipScreen
      onSelectRelationship={(type) => {
        setRelationshipType(type);
        setCurrentScreen('lobby');
      }}
      onBack={() => setCurrentScreen('createJoin')}
    />,
    join: <JoinScreen
      onJoin={(code, playerId) => {
        setRoomCode(code);
        setJoinedPlayerId(playerId);
        setCurrentScreen('lobby');
      }}
      onBack={() => setCurrentScreen('createJoin')}
    />,
    lobby: <LobbyScreen
      gameMode={gameMode}
      relationshipType={relationshipType}
      isHost={isHost}
      roomCode={roomCode}
      joinedPlayerId={joinedPlayerId}
      onStartGame={(p1, p2, pNum) => {
        setPlayer1Name(p1);
        setPlayer2Name(p2);
        setPlayerNumber(pNum);
        if (gameMode === 'connection') {
          setCurrentScreen('game');
        } else if (gameMode === 'compatibility') {
          setCurrentScreen('compatibility');
        } else if (gameMode === 'knowledge') {
          setCurrentScreen('knowledge');
        }
      }}
    />,
    game: <GameScreen
      player1Name={player1Name}
      player2Name={player2Name}
      relationshipType={relationshipType}
      roomCode={roomCode}
      playerId={joinedPlayerId}
      playerNumber={playerNumber}
      onComplete={() => setCurrentScreen('complete')}
    />,
    compatibility: <CompatibilityScreen
      player1Name={player1Name}
      player2Name={player2Name}
      roomCode={roomCode}
      playerId={joinedPlayerId}
      playerNumber={playerNumber}
      onComplete={(results) => {
        setCompatibilityResults(results);
        setCurrentScreen('compatibilityResults');
      }}
    />,
    compatibilityResults: <CompatibilityResultsScreen
      results={compatibilityResults}
      onRestart={() => {
        setCurrentScreen('welcome');
        setGameMode('');
        setRelationshipType('');
        setCompatibilityResults(null);
      }}
    />,
    knowledge: <KnowledgeScreen
      player1Name={player1Name}
      player2Name={player2Name}
      roomCode={roomCode}
      playerId={joinedPlayerId}
      playerNumber={playerNumber}
      onComplete={() => setCurrentScreen('knowledgeResults')}
    />,
    knowledgeResults: <KnowledgeResultsScreen
      onRestart={() => {
        setCurrentScreen('welcome');
        setGameMode('');
        setRelationshipType('');
      }}
    />,
    complete: <CompleteScreen
      onRestart={() => {
        setCurrentScreen('welcome');
        setGameMode('');
        setRelationshipType('');
      }}
    />
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {screens[currentScreen]}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
