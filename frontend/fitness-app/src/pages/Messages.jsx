import React from "react";
import Sidebar from "./Sidebar";
import MessagesContent from "./MessagesContent";

function Messages() {
  return (
    <div className="Messages" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <MessagesContent />
    </div>
  );
}

export default Messages;