import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import OtpLogin from "./components/OtpLogin";
import Notes from "./components/Notes";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check Firebase session
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If Firebase user exists, restore backend JWT from localStorage
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // If no JWT, request new one from backend
          const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/auth/google`,
            {
              email: firebaseUser.email,
              name:
                firebaseUser.displayName || firebaseUser.email.split("@")[0],
            }
          );
          setUser(res.data.user);
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        {!user ? (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Welcome to Notes App
            </h1>
            <Login setUser={setUser} setToken={setToken} />
            <div className="mt-4 text-center text-gray-500">OR</div>
            <OtpLogin setUser={setUser} setToken={setToken} />
          </>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-700">
                Hello, {user.name}
              </h2>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
            <Notes token={token} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
