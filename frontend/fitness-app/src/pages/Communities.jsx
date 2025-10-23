import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import CommunitiesContent from "./CommunitiesContent";
import PostDetail from "./PostDetail";

function Communities() {
  const { id } = useParams();
  
  return (
    <div className="Communities" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      {id ? <PostDetail /> : <CommunitiesContent />}
    </div>
  );
}


export default Communities;