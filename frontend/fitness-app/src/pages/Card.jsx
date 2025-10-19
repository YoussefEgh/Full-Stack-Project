// Card.js
import React from "react";

const Card = ({ title, body }) => {
  return (
    <div style={{
      backgroundColor: "#222",
      padding: "20px",
      borderRadius: "8px",
      width: "250px",
      textAlign: "left",
      margin: "10px"
    }}>
      <div style={{
        backgroundColor: "#555",
        height: "150px",
        marginBottom: "10px"
      }}>
        [Image]
      </div>
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      <p style={{ fontSize: "14px", color: "#ccc" }}>{body}</p>
    </div>
  );
};

export default Card;
