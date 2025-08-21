# Firebase Setup Guide

To enable multiplayer functionality for the "Who Are You?" game, you need to connect it to your Firebase project.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "connection-game")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)

## Step 2: Enable Realtime Database

1. In your Firebase project console, go to "Realtime Database"
2. Click "Create Database"
3. Choose your location (closest to your users)
4. Start in **test mode** for now (you can secure it later)

## Step 3: Get Your Firebase Configuration

1. In your Firebase project console, click the gear icon (⚙️) → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</> icon)
4. Give your app a name (e.g., "Connection Game Web")
5. **Don't** check "Also set up Firebase Hosting" unless you want it
6. Click "Register app"
7. Copy the `firebaseConfig` object

## Step 4: Update Your config.js File

Replace the placeholder values in `config.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

## Step 5: Configure Database Rules (Optional but Recommended)

For better security, update your Realtime Database rules:

1. Go to "Realtime Database" → "Rules" tab
2. Replace the default rules with:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        ".validate": "$roomCode.matches(/^[A-Z0-9]{6}$/)"
      }
    }
  }
}
```

This allows read/write access to room data but validates that room codes are 6 characters of uppercase letters and numbers.

## Step 6: Test Your Setup

1. Open your game in a web browser
2. Select a relationship type
3. Choose "Two Phones" mode
4. Try creating a room - you should see a 6-character room code
5. Open the game in another browser tab/window
6. Join the room using the code

## Troubleshooting

- **"Firebase not connected"**: Check that your config values are correct and your Firebase project has Realtime Database enabled
- **"Permission denied"**: Make sure your database rules allow read/write access
- **"Room not found"**: Ensure both players are using the exact same room code (case-sensitive)

## Security Notes

- The current setup uses test mode for easy development
- For production, consider implementing proper authentication
- Consider adding data validation and user limits
- Monitor your Firebase usage to stay within free tier limits

## Firebase Free Tier Limits

- Realtime Database: 1GB storage, 10GB/month transfer
- Should be more than enough for this game unless you have thousands of concurrent users

Your game will now use Firebase for real-time multiplayer functionality!