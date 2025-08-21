// Firebase Configuration
// Replace with your own Firebase project credentials

const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase (if you want to add multiplayer features later)
// For now, this app works locally without Firebase
// Uncomment the lines below when you're ready to add Firebase features

/*
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
*/

console.log('Config loaded - Firebase integration ready for future use');