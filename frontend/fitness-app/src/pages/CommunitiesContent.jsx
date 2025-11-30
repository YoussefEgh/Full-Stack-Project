import React, { useState, useEffect } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function CommunitiesContent() {
  const navigate = useNavigate();
  const { idToken } = useAuth();
  const [sortBy, setSortBy] = useState("date"); // "date" or "likes"
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General'
  });

  useEffect(() => {
    fetchPosts();
  }, [sortBy, idToken]);

  const fetchPosts = async () => {
    if (!idToken) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/?sort_by=${sortBy}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
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
    if (!idToken) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${id}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(prev => 
          prev.map(p => p.id === id ? { ...p, likes: data.likes, liked: data.liked } : p)
        );
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!idToken) {
      setError('Not authenticated');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      
      const response = await fetch('http://127.0.0.1:8000/api/communities/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          category: newPost.category
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const data = await response.json();
      console.log('Post created:', data);
      
      // Reset form and close modal
      setNewPost({ title: '', content: '', category: 'General' });
      setShowCreateModal(false);
      setError(null);
      
      // Refresh posts list
      await fetchPosts();
    } catch (err) {
      setError(err.message);
      console.error('Error creating post:', err);
    } finally {
      setCreating(false);
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
          flexDirection: "column",
          gap: "20px",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <FiLoader 
          style={{
            fontSize: "48px",
            color: "#00bfff",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ margin: 0 }}>Loading posts...</p>
        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
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
        minWidth: 0,
        height: "100%",
        backgroundColor: "#333",
        color: "#fff",
        padding: "40px",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box"
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
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            backgroundColor: "#00d26a",
            border: "none",
            borderRadius: "20px",
            padding: "8px 16px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "all 0.2s ease",
            marginLeft: "auto",
          }}
        >
          ✨ Create Post
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "25px", width: "100%", maxWidth: "100%" }}>
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
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              wordWrap: "break-word",
              overflowWrap: "break-word",
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
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <h3 style={{ margin: 0, wordWrap: "break-word", overflowWrap: "break-word", flex: "1 1 auto", minWidth: 0 }}>{post.title}</h3>
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
                color: post.liked ? "#00bfff" : "#aaa",
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(post.id);
              }}
            >
              {post.liked ? <AiFillLike /> : <AiOutlineLike />}
              <span>{post.likes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
              setNewPost({ title: '', content: '', category: 'General' });
              setError(null);
            }
          }}
        >
          <div
            style={{
              backgroundColor: "#444",
              border: "2px solid #00bfff",
              borderRadius: "15px",
              padding: "30px",
              width: "90%",
              maxWidth: "600px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "20px", color: "#00bfff" }}>
              Create New Post
            </h2>

            {error && (
              <div
                style={{
                  backgroundColor: "#ff6b6b",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "20px",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#ccc",
                    fontWeight: "bold",
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  style={{
                    width: "100%",
                    backgroundColor: "#555",
                    border: "1px solid #666",
                    borderRadius: "5px",
                    padding: "10px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                  placeholder="Enter post title..."
                  disabled={creating}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#ccc",
                    fontWeight: "bold",
                  }}
                >
                  Category
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({ ...newPost, category: e.target.value })
                  }
                  style={{
                    width: "100%",
                    backgroundColor: "#555",
                    border: "1px solid #666",
                    borderRadius: "5px",
                    padding: "10px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                  disabled={creating}
                >
                  <option value="General">General</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Exercises">Exercises</option>
                  <option value="Nutrition">Nutrition</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#ccc",
                    fontWeight: "bold",
                  }}
                >
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  style={{
                    width: "100%",
                    minHeight: "150px",
                    backgroundColor: "#555",
                    border: "1px solid #666",
                    borderRadius: "5px",
                    padding: "10px",
                    color: "#fff",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                  placeholder="Write your post content..."
                  disabled={creating}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPost({ title: '', content: '', category: 'General' });
                    setError(null);
                  }}
                  disabled={creating}
                  style={{
                    backgroundColor: "#666",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px 20px",
                    color: "#fff",
                    cursor: creating ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newPost.title.trim() || !newPost.content.trim()}
                  style={{
                    backgroundColor: 
                      creating || !newPost.title.trim() || !newPost.content.trim()
                        ? "#666"
                        : "#00d26a",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px 20px",
                    color: "#fff",
                    cursor: 
                      creating || !newPost.title.trim() || !newPost.content.trim()
                        ? "not-allowed"
                        : "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {creating ? "Creating..." : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunitiesContent;
