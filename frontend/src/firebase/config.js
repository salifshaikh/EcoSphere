import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAgq441J3hNl4mJLLchNadZudWOuw1jqgU",
    authDomain: "ecosphere-4eec1.firebaseapp.com",
    projectId: "ecosphere-4eec1",
    storageBucket: "ecosphere-4eec1.firebasestorage.app",
    messagingSenderId: "1053647753886",
    appId: "1:1053647753886:web:d2eaad81eaacd11eeaa18f",
    measurementId: "G-YEBR21RFVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔥 Set auth persistence
setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("Firebase Auth Persistence Set"))
    .catch((error) => console.error("Error setting persistence:", error));

const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
const db = getFirestore(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, analytics, db, PhoneAuthProvider, RecaptchaVerifier, firestore, storage };
