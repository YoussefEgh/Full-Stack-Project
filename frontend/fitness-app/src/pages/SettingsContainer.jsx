// Settings.js
import React from "react";
import Sidebar from "./Sidebar";
import Settings from "./Settings";

function SettingsContainer() {
  return (
    <div className="Settings" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Settings />
    </div>
  );
}

export default SettingsContainer;
