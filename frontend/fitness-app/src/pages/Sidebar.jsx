import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiActivity, FiBarChart2, FiMessageCircle, FiUsers, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null); // track which item is hovered

  const menuItems = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "Workouts", path: "/workouts", icon: <FiActivity /> },
    { name: "Progress", path: "/progress", icon: <FiBarChart2 /> },
    { name: "Messages", path: "/messages", icon: <FiMessageCircle /> },
    { name: "Communities", path: "/communities", icon: <FiUsers /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{ width: "250px", backgroundColor: "#111", color: "#fff", padding: "20px" }}>
      <div style={{ marginBottom: "30px", fontSize: "24px", textAlign: "center" }}>
        <img style={{ width: "175px", height: "175px" }} src="/momentum_logo.png" alt="Logo" />
      </div>
      {menuItems.map((item, index) => {
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "25px 0",
              fontSize: "20px",
              cursor: "pointer",
              transform: isHovered ? "translateX(10px)" : "translateX(0)",
              color: isHovered ? "#1abc9c" : "#fff",
              transition: "transform 0.2s ease, color 0.2s ease"
            }}
          >
            {item.icon}
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
