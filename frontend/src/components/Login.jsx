import React from "react";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { auth, googleProvider } from "../firebase";

function Login({ setUser, setToken }) {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const res = await axios.post("http://localhost:5000/auth/google", {
        email: user.email,
        name: user.displayName || user.email.split("@")[0],
      });
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      Login with Google
    </button>
  );
}

export default Login;
