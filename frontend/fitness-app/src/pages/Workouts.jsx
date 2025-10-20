// Workouts.js
import React from "react";
import Sidebar from "./Sidebar";
import WorkoutsContent from "./WorkoutsContent";

function Workouts() {
  return (
    <div className="Workouts" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <WorkoutsContent />
    </div>
  );
}

export default Workouts;
