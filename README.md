# Who Are You?

A relationship discovery game that helps people connect through meaningful questions. Available as both a web app and React Native mobile app with real-time Firebase multiplayer.

---

## 📁 Project Structure

```
Connection-app/
├── index.html                          # Web app (main entry)
├── script.js                          # Web app game logic
├── styles.css                         # Web app styles
├── config.js                          # Firebase config (web)
├── compatibility-questions-ranking.js # Compatibility test questions
├── connection-app-mobile/             # React Native mobile app
│   ├── App.js                         # Mobile app root
│   ├── package.json                   # Dependencies
│   ├── app.json                       # Expo config
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js            # Firebase setup (mobile)
│   │   ├── data/
│   │   │   └── compatibilityQuestions.js
│   │   └── screens/                   # All mobile screens
│   │       ├── WelcomeScreen.js
│   │       ├── CreateJoinScreen.js
│   │       ├── JoinScreen.js
│   │       ├── LobbyScreen.js
│   │       ├── CompatibilityScreen.js
│   │       ├── CompatibilityResultsScreen.js
│   │       └── ...
```

---

## 🎮 Game Modes

### 1. **Deepen Your Connection** (Classic Mode)
- 5 rounds of progressively deeper questions
- Turn-based gameplay
- Designed for meaningful conversation

### 2. **Compatibility Test** ✅ FULLY IMPLEMENTED
- 10 science-backed questions about values, communication, and vision
- **Ranking system**: Players rank 4 options from most to least important
- After each question: Shows comparison screen with match percentage
- Final results: Overall compatibility score, breakdown by category, insights
- **Available in both web and mobile apps**

### 3. **How Well Do You Know Each Other?** (Knowledge Quiz)
- Quiz-style gameplay
- Players predict each other's answers
- Scoring system
- **Web only** (mobile placeholder exists)

---

## 🌐 Web App

### Technologies
- Vanilla JavaScript
- Firebase Realtime Database for multiplayer
- Responsive design (works on mobile browsers)

### Running the Web App
1. Open `index.html` in a browser, OR
2. Use a local server:
   ```bash
   python3 -m http.server 8000
   ```
3. Navigate to `http://localhost:8000`

### Firebase Configuration
- Database URL: `https://who-are-you-a2008-default-rtdb.firebaseio.com`
- Config located in: `config.js`

---

## 📱 Mobile App (React Native)

### Technologies
- **Expo SDK 54**
- **React Native 0.81.4**
- **Firebase 9.23.0** (with compat API for React Native)
- Online multiplayer only (no offline mode)

### Current Status
✅ **Compatibility Test Mode**: Fully functional
- Room code system for multiplayer
- 10 ranking questions
- Comparison screens after each question
- Final results with insights
- Firebase real-time sync

⚠️ **Other Modes**: Placeholder screens only

### Setup & Installation

```bash
cd connection-app-mobile
npm install
npx expo start
```

### Testing the Mobile App

**Option 1: Physical Device (Recommended)**
1. Install **Expo Go** app on your phone
2. Run `npx expo start`
3. Scan the QR code with Expo Go (iOS) or Camera app (Android)

**Option 2: Simulator/Emulator**
- iOS: `npx expo start --ios` (requires Xcode)
- Android: `npx expo start --android` (requires Android Studio)

**Option 3: Web Browser**
- Run `npx expo start --web`
- Opens in browser (useful for testing)

### Known Issues & Solutions

#### Firebase Import Errors
- **Solution**: Mobile app uses Firebase 9.23.0 with compat API
- Import syntax: `import firebase from 'firebase/compat/app'`

#### Multiple Expo Servers
- **Problem**: Port conflicts when multiple servers run
- **Solution**: Kill all processes:
  ```bash
  pkill -f "expo"
  lsof -ti:8081 | xargs kill -9
  npx expo start --clear
  ```

#### Compatibility Test Flow Issues Fixed
- ✅ Removed relationship selection for compatibility mode
- ✅ Fixed player ID consistency (JoinScreen → LobbyScreen)
- ✅ Both players must mark ready with names to start
- ✅ Only counts valid players (playerNumber 1 or 2)

---

## 🔥 Firebase Multiplayer Flow

### Creating a Game
1. Player 1: Select mode → Create Game
2. Room code generated (e.g., "APPLE", "YOUTH")
3. Room code displayed in lobby
4. Player 1 enters name → Clicks "I'm Ready"
5. Waits for Player 2

### Joining a Game
1. Player 2: Select mode → Join Game
2. Enter room code from Player 1
3. Validates room exists and isn't full
4. Player 2 enters name → Clicks "I'm Ready"
5. Game auto-starts when both ready

### Room Structure (Firebase)
```javascript
rooms/
  {ROOMCODE}/
    hostPlayerId: "player-abc123"
    gameMode: "compatibility"
    players/
      player-abc123/
        playerNumber: 1
        name: "Mike"
        connected: true
        ready: true
      player-xyz789/
        playerNumber: 2
        name: "Alex"
        connected: true
        ready: true
    gameState/
      currentQuestion: 0
      gameStarted: true
    compatibility/
      0/
        player1Answer: {a: 1, b: 2, c: 3, d: 4}
        player2Answer: {a: 2, b: 1, c: 4, d: 3}
```

---

## 🐛 Debugging

### Console Logging
The mobile app has extensive emoji-based logging:
- 🎮 Room creation
- 🔵 Join process steps
- 📡 Firebase data updates
- 👥 Player counts
- ✅ Success events
- ❌ Errors

### View Logs
- **Terminal**: Where you ran `npx expo start`
- **Browser DevTools**: F12 → Console tab
- **Phone**: Logs appear in terminal automatically

### Common Debug Commands
```bash
# View all Expo servers
ps aux | grep expo

# Kill specific port
lsof -ti:8081 | xargs kill -9

# Clear Metro bundler cache
npx expo start --clear

# Check Firebase version
npm list firebase
```

---

## 📝 Development Notes

### Key Architecture Decisions

1. **No Offline Mode**: Mobile app requires internet/Firebase
   - All gameplay is multiplayer
   - Room codes connect devices

2. **Player ID Consistency**:
   - Generated in JoinScreen
   - Passed to LobbyScreen via App.js
   - Same ID used throughout session
   - Prevents duplicate players in Firebase

3. **Game Flow** (Compatibility Mode):
   ```
   Welcome → CreateJoin → Lobby → CompatibilityScreen →
   ComparisonScreen (10x) → CompatibilityResultsScreen
   ```

4. **Relationship Selection**:
   - Required for "Deepen Your Connection" mode
   - Skipped for Compatibility and Knowledge modes

### Recent Bug Fixes (Checkpoint: 123d2d9)

1. ✅ **Fixed duplicate player bug**
   - Problem: New playerId generated in LobbyScreen
   - Solution: Pass playerId from JoinScreen through App.js

2. ✅ **Fixed game start logic**
   - Only starts when both players have valid playerNumbers (1 or 2)
   - Ignores stale players from old sessions
   - Checks for names before starting

3. ✅ **Fixed Firebase imports**
   - Downgraded to Firebase 9.23.0
   - Uses compat API for React Native compatibility

---

## 🚀 Deployment

### Web App
- Host `index.html`, `script.js`, `styles.css`, and JS files
- Works on any static hosting (Netlify, Vercel, GitHub Pages)

### Mobile App
Not yet deployed to app stores. Current testing methods:
- Expo Go (development)
- `expo build` for standalone apps (future)

---

## 📦 Dependencies

### Mobile App (connection-app-mobile)
```json
{
  "expo": "~54.0.0",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "firebase": "9.23.0",
  "expo-status-bar": "~3.0.8"
}
```

### Web App
- Firebase SDK (loaded via CDN in index.html)
- No build process required

---

## 🎯 Next Steps / TODO

### Mobile App
- [ ] Implement full "Deepen Your Connection" mode with Firebase sync
- [ ] Implement "Knowledge Quiz" mode
- [ ] Add Firebase authentication (optional)
- [ ] Handle disconnections gracefully
- [ ] Add loading states and better error messages
- [ ] Clean up old Firebase rooms (auto-expire)
- [ ] Add animations/transitions between screens
- [ ] Test on actual iOS and Android devices thoroughly

### Both Apps
- [ ] Add sound effects
- [ ] Add haptic feedback (mobile)
- [ ] Implement friend list / saved games
- [ ] Add chat between players (optional)
- [ ] Analytics integration

---

## 🔐 Firebase Security

**Current Setup**:
- Database rules allow read/write (development mode)
- **TODO**: Implement proper security rules for production

**Recommended Rules**:
```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": "!data.exists() || data.child('players').hasChild(auth.uid)"
      }
    }
  }
}
```

---

## 📞 Support / Questions

For the next AI assistant picking up this project:
1. Read this entire README
2. Review `connection-app-mobile/src/` for current mobile implementation
3. Check commit `123d2d9` for the working mobile app checkpoint
4. Test the Compatibility mode first - it's fully functional
5. Review console logs - they have emoji indicators for debugging

---

## 🔄 Latest Session Updates (October 2025)

### Recent Implementations & Fixes

**Session Focus**: Implementing new game modes and fixing Firebase synchronization issues

#### ✅ Implemented Features

1. **"Deepen Your Connection" Mode (Mobile)** - Commit `0d99247`
   - GameScreen.js with 5 progressive rounds
   - Turn-based multiplayer with Firebase sync
   - 1,350+ questions across 15 categories (questionsDatabase.js)
   - Category selection per round with themed progression
   - Round announcements and progress tracking

2. **"Knowledge Quiz" Mode (Mobile)** - Commit `0d99247`
   - KnowledgeScreen.js with 15-question quiz format
   - Alternating answerer/predictor gameplay
   - Real-time score tracking
   - 30+ quiz questions (knowledgeQuestions.js)
   - Visual feedback for correct/incorrect predictions

3. **Tap-to-Swap Ranking Interface** - Commit `ce77405`
   - Replaced complex drag-and-drop with simple tap interface
   - Tap item to select (purple highlight + checkmark)
   - Tap another item to swap positions
   - Works perfectly on mobile and web

#### 🐛 Major Bug Fixes

1. **Firebase Sync - Comparison Screen** - Commits `3d7c659`, `a5a67ff`, `99a64f7`
   - **Issue**: Players stuck on different screens after submitting answers
   - **Root Cause**: Firebase listener timing issues and React state update race conditions
   - **Solution**:
     - Dual-path comparison trigger (listener + immediate check)
     - `hasShownComparison` flag prevents duplicate triggers
     - Direct Firebase check after submit for immediate sync
     - `comparisonData` state stores Firebase data directly

2. **Comparison Screen Rendering** - Commit `800376b`
   - **Issue**: Crash with "Cannot convert undefined value to object"
   - **Solution**: Added safety checks for rankings before sorting

3. **Player Synchronization** - Commit `96868b4`
   - Added waiting states when one player submits
   - Both players must click "Continue" to advance together
   - Firebase `readyToContinue` flags for coordination

#### ⚠️ Known Issues (IN PROGRESS)

1. **Firebase Sync Still Flaky**
   - Sometimes one player sees "Loading comparison..." while other sees "Waiting for other player..."
   - Last attempted fix: Immediate Firebase check after submit (commit `99a64f7`)
   - **Next steps**: Need to debug why listener doesn't fire reliably for both players

#### 🛠️ Useful Commands

**Kill All Servers**:
```bash
pkill -9 -f "expo" && pkill -9 -f "node" && lsof -ti:8081 | xargs kill -9 2>/dev/null && echo "✅ All servers killed"
```

**Start Fresh**:
```bash
cd /Users/michaelsoni/Documents/GitHub/Connection-app/connection-app-mobile
npx expo start --clear
```

**Test Multiplayer (Web)**:
- Chrome: Player 1 - Create game
- Safari: Player 2 - Join with room code
- Both: Test synchronization

**Test Multiplayer (Mobile)**:
- Scan QR code with Expo Go app
- Or press `w` in terminal for web browser

#### 📊 File Changes This Session

**New Files**:
- `connection-app-mobile/src/screens/GameScreen.js` (643 lines)
- `connection-app-mobile/src/screens/KnowledgeScreen.js` (492 lines)
- `connection-app-mobile/src/data/questionsDatabase.js` (1,350+ questions)
- `connection-app-mobile/src/data/knowledgeQuestions.js` (30+ questions)

**Modified Files**:
- `connection-app-mobile/src/screens/CompatibilityScreen.js` (extensive Firebase sync fixes)
- `connection-app-mobile/App.js` (added roomCode, playerId, playerNumber props)
- `connection-app-mobile/src/screens/LobbyScreen.js` (playerNumber handling)

#### 🎯 Next Session Priorities

1. **Fix Firebase sync completely** - Ensure both players always see comparison screen together
2. **Test full game flow** - End-to-end testing of all 10 questions
3. **Test new game modes** - GameScreen and KnowledgeScreen need full testing
4. **Handle edge cases** - Disconnections, refreshes, concurrent games

#### 🔍 Debugging Tips

**Console Logs to Watch**:
- `✅✅✅ BOTH ANSWERS DETECTED!` - Comparison should trigger
- `🎉 BOTH ANSWERS ALREADY IN FIREBASE!` - Immediate check worked
- `📡 Listener fired for Q X` - Firebase listener is working
- `playerNumber:` - Should be 1 or 2 (not 0)

**Common Issues**:
- Port 8081 already in use → Run kill command above
- Comparison screen not showing → Check browser console logs
- One player stuck waiting → Firebase sync issue (check logs)

---

**Last Updated**: October 2025 (Checkpoint: `99a64f7`)
**Latest Commits**:
- `99a64f7` - Add immediate Firebase check after submitting answer
- `ce77405` - Replace drag-and-drop with tap-to-swap interface
- `0d99247` - Implement "Deepen Your Connection" and "Knowledge Quiz" modes
