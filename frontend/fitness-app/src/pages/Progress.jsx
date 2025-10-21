// Progress.js
import React from "react";
import Sidebar from "./Sidebar";
import ProgressContent from "./ProgressContent";

function Progress() {
  return (
    <div className="Progress" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <ProgressContent />
    </div>
  );
}


export default Progress;
