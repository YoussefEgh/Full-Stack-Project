import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // 👈 import icons

const ExerciseCard = ({ exercise }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #111, #0a0a0a)",
        border: "1px solid #222",
        borderRadius: "14px",
        padding: "20px",
        color: "#fff",
        position: "relative",
      }}
    >
      {/* Title and Buttons Container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "15px",
        }}
      >
        {/* Exercise Title */}
        <h3
          style={{
            margin: 0,
            color: "#fff",
            fontSize: "18px",
            flex: 1,
            minWidth: 0, // Allow flex item to shrink below content size
            wordWrap: "break-word",
            overflowWrap: "break-word",
            lineHeight: "1.5",
          }}
        >
          {exercise.name}
        </h3>

        {/* Top-right Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px", // Reduced gap to bring buttons closer together
            flexShrink: 0,
          }}
        >
        {/* Heart Icon */}
        <button
          onClick={toggleFavorite}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: isFavorite ? "red" : "#aaa",
            fontSize: "22px",
            padding: "0",
            margin: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1",
          }}
          aria-label="Favorite"
        >
          {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>

        {/* Info Button */}
        <button
          onClick={openModal}
          style={{
          backgroundColor: "#1abc9c",
          color: "#000",
          border: "none",
          borderRadius: "4px",
          padding: "5px 10px",
          cursor: "pointer",
          fontWeight: "bold",
          }}
        >
          Info
        </button>
        </div>
      </div>

      {/* Exercise GIF */}
      {exercise.gifUrl && (
        <div
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            style={{
              maxWidth: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Basic Summary */}
      <div style={{ fontSize: "14px" }}>
        <p>
          <strong>Body Parts:</strong>{" "}
          {exercise.bodyParts?.join(", ") || "N/A"}
        </p>
        <p>
          <strong>Equipment:</strong> {exercise.equipments?.join(", ") || "N/A"}
        </p>
        <p>
          <strong>Target Muscles:</strong>{" "}
          {exercise.targetMuscles?.join(", ") || "N/A"}
        </p>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <>
          {/* Background Overlay */}
          <div
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 1000,
            }}
          ></div>

          {/* Modal Content */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(135deg, #111, #0a0a0a)",
              border: "1px solid #222",
              color: "#fff",
              padding: "25px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "500px",
              zIndex: 1001,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{exercise.name}</h2>

            {exercise.gifUrl && (
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  style={{
                    maxWidth: "100%",
                    borderRadius: "4px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <p>
              <strong>Body Parts:</strong>{" "}
              {exercise.bodyParts?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Equipment:</strong>{" "}
              {exercise.equipments?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Target Muscles:</strong>{" "}
              {exercise.targetMuscles?.join(", ") || "N/A"}
            </p>
            {exercise.secondaryMuscles?.length > 0 && (
              <p>
                <strong>Secondary Muscles:</strong>{" "}
                {exercise.secondaryMuscles.join(", ")}
              </p>
            )}

            {exercise.instructions && exercise.instructions.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <p>
                  <strong>Instructions:</strong>
                </p>
                <ol style={{ paddingLeft: "20px", fontSize: "14px" }}>
                  {exercise.instructions.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: "6px" }}>
                      {step.replace(/^Step:\d+\s*/i, "").trim()}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <button
              onClick={closeModal}
              style={{
                marginTop: "20px",
                backgroundColor: "#1abc9c",
                color: "#000",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExerciseCard;
