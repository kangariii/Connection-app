# Testing Guide for New Game Modes

## ✅ Setup Complete
- Expo server running at: http://localhost:8081
- Chrome opened for Player 1
- Safari opened for Player 2

---

## 🎮 Test 1: "Deepen Your Connection" Mode

### Player 1 (Chrome):
1. Wait for splash screen to finish
2. Click **"Deepen Your Connection"** button
3. Click **"Create Game"** button
4. Select a relationship type (e.g., "Friends", "Dating", "Married")
5. **IMPORTANT**: Note the room code displayed (e.g., "APPLE", "YOUTH")
6. Enter your name (e.g., "Mike")
7. Click **"I'm Ready"** button
8. Wait for Player 2...

### Player 2 (Safari):
1. Wait for splash screen to finish
2. Click **"Deepen Your Connection"** button
3. Click **"Join Game"** button
4. Enter the room code from Player 1
5. Enter your name (e.g., "Alex")
6. Click **"I'm Ready"** button

### Gameplay (Both Players):
1. **Round 1 Announcement** should appear
2. **Player 1's turn first**:
   - Player 1 sees 3 categories (Favorites, Daily Life, Fun Facts)
   - Player 1 clicks a category
   - Player 1 clicks a question
   - Question displays for both players
   - Player 1 clicks "Next"

3. **Player 2's turn**:
   - Player 2 sees categories
   - Player 2 selects category and question
   - Both see the question
   - Player 2 clicks "Next"

4. **Round 2 starts** automatically
   - Both see "Round 2" announcement
   - Player 1 goes first again
   - Continue same pattern

5. **Complete all 5 rounds**
6. Both players should see completion screen

### ✅ What to verify:
- [ ] Room code works across browsers
- [ ] Firebase syncs player names
- [ ] Turn alternation works (P1, P2, P1, P2...)
- [ ] Categories appear correctly for each round
- [ ] Questions load from database
- [ ] Both players see same question
- [ ] Progress bar updates
- [ ] All 5 rounds complete successfully
- [ ] No console errors

---

## 🎯 Test 2: "How Well Do You Know Each Other?" Mode

### Player 1 (Chrome):
1. Refresh page (or restart app)
2. Click **"How Well Do You Know Each Other?"**
3. Click **"Create Game"**
4. Note the room code
5. Enter name: "Mike"
6. Click **"I'm Ready"**

### Player 2 (Safari):
1. Refresh page
2. Click **"How Well Do You Know Each Other?"**
3. Click **"Join Game"**
4. Enter room code
5. Enter name: "Alex"
6. Click **"I'm Ready"**

### Gameplay (Both Players):
1. **Question 1 - Player 1 Answers**:
   - Player 1 sees a question with 4 options
   - Player 1 selects an answer
   - Player 2 waits (sees waiting state)

2. **Player 2 Predicts**:
   - Player 2 sees same question
   - Player 2 predicts what Player 1 answered
   - Player 1 waits

3. **Result Screen**:
   - Both see if prediction was correct (✓ or ✗)
   - Scores update
   - Click "Continue"

4. **Question 2 - Player 2 Answers**:
   - Player 2 answers
   - Player 1 predicts
   - Result shown

5. **Continue alternating** for all 15 questions

6. **Final Results**:
   - Both see final scores
   - Player 1 Score: X/15
   - Player 2 Score: Y/15

### ✅ What to verify:
- [ ] Room code connects both players
- [ ] Alternating answerer/predictor roles work
- [ ] Answer syncs via Firebase
- [ ] Prediction phase appears after answer
- [ ] Correct/incorrect feedback shows
- [ ] Scores increment properly
- [ ] All 15 questions complete
- [ ] Results screen shows final scores
- [ ] No console errors

---

## 🐛 Common Issues to Check

### Firebase Connection:
- Open browser console (F12)
- Look for console.log messages with emojis:
  - 🎮 = Game mode selection
  - 📡 = Firebase sync
  - ✅ = Success
  - ❌ = Errors

### If game doesn't start:
- Check both players entered names
- Check both players clicked "I'm Ready"
- Look for Firebase sync logs in console

### If turns don't work:
- Only active player should see categories/options
- Other player should see "Waiting for [Name]..."

### If questions don't load:
- Check console for "questionsDatabase" or "knowledgeQuestions" errors
- Verify data files exist in src/data/

---

## 📊 Expected Console Logs

### GameScreen (Connection Mode):
```
🎮 GameScreen mounted with: {...}
📡 Setting up game state listener for room: APPLE
📡 Game state updated: {...}
🎮 Starting Round 1
✅ Category selected: Favorites
✅ Question selected
```

### KnowledgeScreen (Quiz Mode):
```
🎯 KnowledgeScreen mounted with: {...}
📡 Setting up knowledge quiz listeners for room: YOUTH
✅ Answer selected: Option A
📡 Knowledge question data updated: {...}
🎯 Prediction selected: Option A
✅ Correct! Score updated
```

---

## ✅ Success Criteria

Both game modes are fully working when:

1. **Deepen Your Connection**:
   - ✅ Completes all 5 rounds
   - ✅ Turn alternation works
   - ✅ Both players stay synced
   - ✅ No Firebase errors

2. **Knowledge Quiz**:
   - ✅ Completes all 15 questions
   - ✅ Scores track correctly
   - ✅ Answer/predict phases work
   - ✅ Results display properly

---

## 🚀 Next Steps

**Current Status**: Ready for manual testing!
**Server**: http://localhost:8081 (RUNNING)

Both Chrome and Safari should already be open. Follow the test procedures above!
