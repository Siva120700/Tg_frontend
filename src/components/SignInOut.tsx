import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebaseconfig";
import { useDispatch } from "react-redux";
import axios from "axios";

type User = {
  name: string;
  uid: string;
  email: string;
} | null;

const GoogleSignIn: React.FC = () => {
  const [user, setUser] = useState<User>(null);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, uid, email } = result.user;

      setUser({
        name: displayName ?? "Unknown User",
        uid,
        email: email ?? "No email",
      });

      // Save user info to database
      await axios.post("/api/saveUser", { name: displayName, uid, email });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => setUser(null));
  };

  return (
    <div>
      {user ? (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      ) : (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          onClick={handleSignIn}
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default GoogleSignIn;
