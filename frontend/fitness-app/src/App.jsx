import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Settings from "./pages/Settings.jsx";
import Communities from "./pages/Communities.jsx";
import Progress from "./pages/Progress.jsx";
import Workouts from "./pages/Workouts.jsx";
import SettingsContainer from "./pages/SettingsContainer.jsx";

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

  //navigate("/progress");
};

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="icon">🌐</div>
        <p className="icon-label">Lock in today.</p>
        <h1 className="app-title">Sign In</h1>

        <form className="login-card" onSubmit={handleSubmit}>
          <label>Your Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Your Password</label>
          <input
            type="password"
            placeholder="Password"
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
        <Route path="/communities" element={<Communities />} />
      </Routes>
    </Router>
  );
}

export default App;
