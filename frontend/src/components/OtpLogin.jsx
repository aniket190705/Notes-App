import React, { useState } from "react";
import axios from "axios";

function OtpLogin({ setUser, setToken }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(""); // <-- message state
  const [error, setError] = useState("");

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/auth/send-otp", { email });
      setMessage(`OTP sent to ${email}. Please check your inbox.`);
      setError("");
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      setMessage("");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/verify-otp", {
        email,
        otp,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setError("");
      setMessage("Login successful!");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {step === 1 ? (
        <>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
          />
          <button
            onClick={sendOtp}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-green-300"
          />
          <button
            onClick={verifyOtp}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Verify OTP
          </button>
        </>
      )}

      {/* Feedback messages */}
      {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default OtpLogin;
