import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getRandomKnowledgeQuestions } from '../data/knowledgeQuestions';
import { getDatabase } from '../config/firebase';

const database = getDatabase();

export default function KnowledgeScreen({
  player1Name,
  player2Name,
  onComplete,
  roomCode,
  playerId,
  playerNumber
}) {
  const [questionsList, setQuestionsList] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [answerer, setAnswerer] = useState(1); // Which player is answering
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentPrediction, setCurrentPrediction] = useState('');
  const [phase, setPhase] = useState('answer'); // 'answer', 'predict', 'result', 'waiting'
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const isOnlineMode = !!roomCode;

  useEffect(() => {
    console.log('🎯 KnowledgeScreen mounted with:', {
      player1Name, player2Name, roomCode, playerId, playerNumber
    });

    // Get random 15 questions
    const questions = getRandomKnowledgeQuestions(15);
    setQuestionsList(questions);

    // Setup Firebase listeners if online
    if (isOnlineMode) {
      setupKnowledgeListeners();
    }

    return () => {
      // Cleanup listeners
      if (isOnlineMode) {
        database.ref(`rooms/${roomCode}/knowledge`).off();
      }
    };
  }, []);

  const setupKnowledgeListeners = () => {
    console.log('📡 Setting up knowledge quiz listeners for room:', roomCode);

    database.ref(`rooms/${roomCode}/knowledge/${currentQuestion}`).on('value', (snapshot) => {
      const data = snapshot.val();
      console.log('📡 Knowledge question data updated:', data);

      if (data && data.answer && playerNumber !== answerer) {
        // Other player answered, show prediction phase
        setCurrentAnswer(data.answer);
        setPhase('predict');
      }
    });
  };

  const selectAnswer = async (answer, index) => {
    console.log(`✅ Answer selected: ${answer}`);

    setCurrentAnswer(answer);

    if (isOnlineMode) {
      // Sync answer to Firebase
      try {
        await database.ref(`rooms/${roomCode}/knowledge/${currentQuestion}`).update({
          answer: answer,
          answerer: answerer,
          timestamp: Date.now()
        });
        console.log('✅ Answer synced to Firebase');
        setPhase('waiting');
      } catch (error) {
        console.error('❌ Failed to sync answer:', error);
      }
    } else {
      // Offline mode - move to prediction phase
      setTimeout(() => {
        setPhase('predict');
      }, 800);
    }
  };

  const selectPrediction = (prediction) => {
    console.log(`🎯 Prediction selected: ${prediction}`);

    setCurrentPrediction(prediction);

    // Check if correct
    const correct = prediction === currentAnswer;
    setIsCorrect(correct);

    // Update score
    const predictorNumber = answerer === 1 ? 2 : 1;
    if (correct) {
      if (predictorNumber === 1) {
        setPlayer1Score(player1Score + 1);
      } else {
        setPlayer2Score(player2Score + 1);
      }
    }

    // Show result
    setTimeout(() => {
      setPhase('result');
      setShowResult(true);
    }, 800);
  };

  const nextQuestion = () => {
    console.log(`➡️ Moving to next question - Current: ${currentQuestion}`);

    // Alternate answerer
    const newAnswerer = answerer === 1 ? 2 : 1;
    setAnswerer(newAnswerer);

    // Move to next question
    const newQuestion = currentQuestion + 1;
    setCurrentQuestion(newQuestion);

    // Reset state
    setCurrentAnswer('');
    setCurrentPrediction('');
    setShowResult(false);
    setPhase('answer');

    // Check if quiz complete
    if (newQuestion >= questionsList.length) {
      onComplete();
    }
  };

  if (questionsList.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (currentQuestion >= questionsList.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Complete!</Text>
      </View>
    );
  }

  const question = questionsList[currentQuestion];
  const answererName = answerer === 1 ? player1Name : player2Name;
  const predictorNumber = answerer === 1 ? 2 : 1;
  const predictorName = predictorNumber === 1 ? player1Name : player2Name;
  const isMyTurnToAnswer = !isOnlineMode || (playerNumber === answerer);
  const isMyTurnToPredict = !isOnlineMode || (playerNumber === predictorNumber);

  return (
    <View style={styles.container}>
      {/* Score Bar */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreName}>{player1Name}</Text>
          <Text style={styles.scoreValue}>{player1Score}</Text>
        </View>
        <View style={styles.questionProgress}>
          <Text style={styles.questionNum}>{currentQuestion + 1}/{questionsList.length}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreName}>{player2Name}</Text>
          <Text style={styles.scoreValue}>{player2Score}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Answer Phase */}
        {phase === 'answer' && (
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseTitle}>{answererName}'s Answer</Text>
            <Text style={styles.questionText}>{question.question}</Text>

            {isMyTurnToAnswer ? (
              <View style={styles.optionsContainer}>
                {question.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => selectAnswer(option, index)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.waitingContainer}>
                <Text style={styles.waitingText}>
                  Waiting for {answererName} to answer...
                </Text>
                <View style={styles.waitingDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Waiting Phase (online mode only) */}
        {phase === 'waiting' && (
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseTitle}>Answer Submitted</Text>
            <Text style={styles.waitingText}>
              Waiting for {predictorName} to make their prediction...
            </Text>
            <View style={styles.waitingDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        )}

        {/* Predict Phase */}
        {phase === 'predict' && (
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseTitle}>{predictorName}'s Prediction</Text>
            <Text style={styles.questionText}>{question.question}</Text>
            <Text style={styles.instructionText}>
              What did {answererName} answer?
            </Text>

            {isMyTurnToPredict ? (
              <View style={styles.optionsContainer}>
                {question.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => selectPrediction(option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.waitingContainer}>
                <Text style={styles.waitingText}>
                  Waiting for {predictorName} to predict...
                </Text>
                <View style={styles.waitingDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Result Phase */}
        {phase === 'result' && showResult && (
          <View style={styles.phaseContainer}>
            <View style={[
              styles.resultIcon,
              isCorrect ? styles.resultIconCorrect : styles.resultIconIncorrect
            ]}>
              <Text style={styles.resultIconText}>
                {isCorrect ? '✓' : '✗'}
              </Text>
            </View>

            <Text style={styles.resultTitle}>
              {isCorrect ? 'Correct!' : 'Not quite!'}
            </Text>

            <Text style={styles.resultMessage}>
              {isCorrect
                ? `${predictorName} knows ${answererName} well!`
                : `${predictorName} was surprised by the answer!`
              }
            </Text>

            <View style={styles.answerReveal}>
              <Text style={styles.answerRevealLabel}>The answer was:</Text>
              <Text style={styles.answerRevealText}>{currentAnswer}</Text>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentQuestion + 1 >= questionsList.length ? 'See Results' : 'Next Question'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scoreBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(108, 99, 255, 0.3)',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6c63ff',
  },
  questionProgress: {
    alignItems: 'center',
  },
  questionNum: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  phaseContainer: {
    marginTop: 20,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6c63ff',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 30,
  },
  instructionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 25,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  waitingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 25,
  },
  waitingDots: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6c63ff',
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultIconCorrect: {
    backgroundColor: 'rgba(76, 217, 100, 0.2)',
    borderWidth: 3,
    borderColor: '#4CD964',
  },
  resultIconIncorrect: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 3,
    borderColor: '#FF3B30',
  },
  resultIconText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 30,
  },
  answerReveal: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  answerRevealLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 8,
  },
  answerRevealText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
});
