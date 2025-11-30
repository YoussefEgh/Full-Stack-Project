// Workouts.js
import React from "react";
import Sidebar from "./Sidebar";
import WorkoutsContent from "./WorkoutsContent";

function Workouts() {
  return (
    <div className="Workouts" style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Sidebar />
      <WorkoutsContent />
    </div>
  );
}

export default Workouts;
