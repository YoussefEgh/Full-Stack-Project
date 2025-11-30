import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getAuth } from "firebase/auth";

export default function Clusters() {
  const [clusters, setClusters] = useState([]);
  const [myCluster, setMyCluster] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  // Helper to render consistent user card
  function renderUserCard(u) {
    return (
      <div
        key={u.uid}
        style={{
          background: "#141414",
          border: "1px solid #242424",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          transition: "transform .15s ease, box-shadow .15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
      >
        {/* Avatar */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1abc9c",
          }}
        >
          {u.profile_picture ? (
            <img
              src={u.profile_picture}
              alt="pfp"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <>
              {u.first_name?.[0]}
              {u.last_name?.[0]}
            </>
          )}
        </div>

        {/* Name + username */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: "600", fontSize: "17px" }}>
            {u.first_name} {u.last_name}
          </div>
          <div style={{ color: "#1abc9c", fontSize: "14px" }}>@{u.username}</div>
          <div style={{ fontSize: "12px", color: "#777" }}>{u.email}</div>
        </div>
      </div>
    );
  }

  // Fetch ALL clusters, My Cluster, Suggested Friends
  useEffect(() => {
    async function loadAll() {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const [allRes, myRes, sugRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/social/clusters/expanded/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://127.0.0.1:8000/api/social/my-cluster/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://127.0.0.1:8000/api/social/suggested-friends/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const allData = await allRes.json();
      const myData = await myRes.json();
      const sugData = await sugRes.json();

      setClusters(allData.clusters || []);
      setMyCluster(myData.cluster || []);
      setSuggested(sugData.suggested || []);

      setLoading(false);
    }

    loadAll();
  }, []);

  // ============ UI Styles ============
  const pageStyle = {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "#000",
    color: "#fff",
    overflow: "hidden",
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0,
    height: "100%",
    padding: "40px",
    paddingBottom: "60px", // Extra padding at bottom to prevent cutoff
    overflowY: "auto",
    boxSizing: "border-box",
  };

  const sectionHeader = {
    fontSize: "28px",
    fontWeight: "600",
    marginTop: "20px",
    marginBottom: "12px",
  };

  const cardStyle = {
    background: "linear-gradient(135deg, #111, #0a0a0a)",
    border: "1px solid #222",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  };

  const pill = {
    display: "inline-block",
    background: "#1abc9c",
    padding: "6px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    color: "#000",
    marginBottom: "18px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  };

  // ============ RENDER PAGE ============
  return (
    <div style={pageStyle}>
      <Sidebar />

      <div style={contentStyle}>
        <h1 style={{ fontSize: "34px", marginBottom: "6px" }}>🌐 Fitness Clusters</h1>
        <p style={{ color: "#aaa", marginBottom: "30px" }}>
          Automatically generated based on your engagement across posts & replies.
        </p>

        {loading ? (
          <p>Loading clusters...</p>
        ) : (
          <>
            {/* ========================== MY CLUSTER ========================== */}
            <h2 style={sectionHeader}>💪 Your Fitness Cluster</h2>

            <div style={cardStyle}>
              <span style={pill}>Your Cluster</span>
              {myCluster.length === 0 ? (
                <p>You have no interactions yet.</p>
              ) : (
                <div style={gridStyle}>
                  {myCluster.map((u) => renderUserCard(u))}
                </div>
              )}
            </div>

            {/* ========================= SUGGESTED FRIENDS ========================= */}
            <h2 style={sectionHeader}>🤝 Suggested Friends</h2>

            <div style={cardStyle}>
              <span style={pill}>You May Know</span>
              {suggested.length === 0 ? (
                <p>No suggestions — you're already connected!</p>
              ) : (
                <div style={gridStyle}>
                  {suggested.map((u) => renderUserCard(u))}
                </div>
              )}
            </div>

            {/* ========================== ALL CLUSTERS ========================== */}
            <h2 style={sectionHeader}>🌐 All Clusters</h2>

            {clusters.map((group, idx) => (
              <div key={idx} style={cardStyle}>
                <span style={pill}>Cluster {idx + 1}</span>

                <div style={gridStyle}>
                  {group.map((u) => renderUserCard(u))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}