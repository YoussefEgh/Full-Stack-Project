import React, { useState, useEffect } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function CommunitiesContent() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date"); // "date" or "likes"
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/?sort_by=${sortBy}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${id}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(prev => 
          prev.map(p => p.id === id ? { ...p, likes: data.likes } : p)
        );
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: "#333",
          color: "#fff",
          padding: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: "#333",
          color: "#fff",
          padding: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p style={{ color: "#ff6b6b", marginBottom: "20px" }}>Error: {error}</p>
        <button
          onClick={fetchPosts}
          style={{
            backgroundColor: "#00bfff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#333",
        color: "#fff",
        padding: "40px",
        width: "100vw",
        minHeight: "30vw",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>💬 Communities</h1>
      <p style={{ marginBottom: "20px", color: "#ccc" }}>
        Discuss fitness topics like <strong>supplements</strong>,{" "}
        <strong>workouts</strong>, and <strong>nutrition</strong>.
      </p>

      {/* Sorting Buttons */}
      <div style={{ marginBottom: "30px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setSortBy("date")}
          style={{
            backgroundColor: sortBy === "date" ? "#00bfff" : "#666",
            border: "none",
            borderRadius: "20px",
            padding: "8px 16px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: sortBy === "date" ? "bold" : "normal",
            transition: "all 0.2s ease",
          }}
        >
          📅 Latest
        </button>
        <button
          onClick={() => setSortBy("likes")}
          style={{
            backgroundColor: sortBy === "likes" ? "#00bfff" : "#666",
            border: "none",
            borderRadius: "20px",
            padding: "8px 16px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: sortBy === "likes" ? "bold" : "normal",
            transition: "all 0.2s ease",
          }}
        >
          ❤️ Most Liked
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`, { state: { post } })}
            style={{
              backgroundColor: "#444",
              border: "1px solid #555",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.4)",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ margin: 0 }}>{post.title}</h3>
              <span
                style={{
                  backgroundColor: "#666",
                  borderRadius: "20px",
                  padding: "5px 10px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              >
                {post.category}
              </span>
            </div>

            <p style={{ fontSize: "14px", color: "#ddd", marginBottom: "10px" }}>
              <em>by {post.author}</em> • <span style={{ color: "#999" }}>{formatDate(post.created_at)}</span>
            </p>

            <p
              style={{
                marginBottom: "15px",
                fontSize: "15px",
                color: "#ccc",
              }}
            >
              {post.content.slice(0, 100)}...
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#aaa",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(post.id);
              }}
            >
              <AiOutlineLike />
              <span>{post.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunitiesContent;
