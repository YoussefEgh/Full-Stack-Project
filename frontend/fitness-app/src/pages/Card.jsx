// Card.js
import React from "react";

const Card = ({ title, body, onEdit, onDelete }) => {
  return (
    <div style={{
      backgroundColor: "#222",
      padding: "20px",
      borderRadius: "8px",
      width: "250px",
      textAlign: "left",
      margin: "10px",
      position: 'relative'
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
      <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', gap: 8 }}>
        {onEdit && <button onClick={onEdit} style={{ padding: '6px 8px', fontSize: 12, borderRadius: 4, border: 'none', background: '#1976d2', color: '#fff' }}>Edit</button>}
        {onDelete && <button onClick={onDelete} style={{ padding: '6px 8px', fontSize: 12, borderRadius: 4, border: 'none', background: '#d32f2f', color: '#fff' }}>Delete</button>}
      </div>
    </div>
  );
};

export default Card;
