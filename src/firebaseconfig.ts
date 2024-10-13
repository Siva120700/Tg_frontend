import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDzsPAJbBvLnbTIfXjfuQlrvmJayEml_VQ",
  authDomain: "truegradient-e1ac6.firebaseapp.com",
  projectId: "truegradient-e1ac6",
  storageBucket: "truegradient-e1ac6.appspot.com",
  messagingSenderId: "61665199379",
  appId: "1:61665199379:web:fb1d582f30562ce76606e6",
  measurementId: "G-EDJPYHWWWT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
