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

**Last Updated**: January 2025 (Checkpoint: `123d2d9`)
**Latest Working Feature**: Full Compatibility Test mode in mobile app with Firebase multiplayer
