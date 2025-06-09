import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyALlnrwPeEFtu7dXTAFvG4d9OUL-XiY2ao',
    authDomain: 'flippify-3ffff.firebaseapp.com',
    databaseURL: 'https://flippify-3ffff-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: 'flippify-3ffff',
    storageBucket: 'flippify-3ffff.appspot.com',
    messagingSenderId: '238475908658',
    appId: '1:238475908658:web:445ef3455401e1e1ecce2b',
    measurementId: 'G-CP0595TPX9',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestore = getFirestore(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth, firestore };