import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Settings from "./pages/Settings.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  fetch("http://127.0.0.1:8000/api/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        navigate("/settings"); // redirect if login successful
      } else {
        alert(data.message); // show error from Django
      }
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="icon">🌐</div>
        <p className="icon-label">[App icon here]</p>
        <h1 className="app-title">Sign In</h1>

        <form className="login-card" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Value"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Value"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign In</button>
          <a href="#" className="forgot-password">Forgot password?</a>
        </form>
      </div>

      <footer className="footer">
        About | Help Center | Terms of Service | Privacy Policy | Settings
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
