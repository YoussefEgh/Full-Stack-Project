import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Settings from "./pages/Settings.jsx";
import Progress from "./pages/Progress.jsx";
import Workouts from "./pages/Workouts.jsx";
import SettingsContainer from "./pages/SettingsContainer.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    // Redirect to settings page
    navigate("/progress");
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="icon">🌐</div>
        <p className="icon-label">[App icon here]</p>
        <h1 className="app-title">Sign In</h1>

        <form className="login-card" onSubmit={handleSubmit}>
          <label>Your Email</label>
          <input
            type="email"
            placeholder="Value"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Your Password</label>
          <input
            type="password"
            placeholder="Value"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign In</button>
          <a href="/progress" className="forgot-password">Forgot password?</a>
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
        <Route path="/settings" element={<SettingsContainer />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </Router>
  );
}

export default App;
