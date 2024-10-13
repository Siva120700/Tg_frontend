import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGEBUCKET",
  messagingSenderId: "Your_messaging_sender_Id",
  appId: "YOUR_APPID",
  measurementId: "Your_measurementId"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
