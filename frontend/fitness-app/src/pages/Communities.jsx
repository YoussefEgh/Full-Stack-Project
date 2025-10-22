import React from "react";
import Sidebar from "./Sidebar";
import CommunitiesContent from "./CommunitiesContent";

function Communities() {
  return (
    <div className="Communities" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <CommunitiesContent />
    </div>
  );
}


export default Communities;