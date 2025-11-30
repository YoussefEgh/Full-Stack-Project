import React from "react";
import Sidebar from "./Sidebar";
import Settings from "./Settings";

function SettingsContainer() {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Sidebar />
      <Settings />
    </div>
  );
}

export default SettingsContainer;
