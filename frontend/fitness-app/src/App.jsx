import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Settings from "./pages/Settings.jsx";
import Communities from "./pages/Communities.jsx";
import CommunitiesContent from "./pages/CommunitiesContent.jsx";
import Messages from "./pages/Messages.jsx";
import Progress from "./pages/Progress.jsx";
import Workouts from "./pages/Workouts.jsx";
import SettingsContainer from "./pages/SettingsContainer.jsx";
import PostDetail from "./pages/PostDetail.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<SettingsContainer />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/post/:id" element={<Communities />} />

      </Routes>
    </Router>
  );
}

export default App;
