import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";

function PostDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [newReply, setNewReply] = useState("");
  const [post, setPost] = useState(state?.post);
  const [loading, setLoading] = useState(!state?.post);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state?.post && id) {
      fetchPost();
    }
  }, [id, state?.post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${id}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
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
        <p>Loading post...</p>
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
          onClick={fetchPost}
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

  if (!post) {
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
          width: "100vw"
        }}
      >
        <p>Post not found.</p>
      </div>
    );
  }

  const handleReply = async (e) => {
    e.preventDefault();
    if (newReply.trim()) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${post.id}/replies/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: "You", // In a real app, this would be the logged-in user
            text: newReply.trim(),
          }),
        });
        
        if (response.ok) {
          const replyData = await response.json();
          setPost(prev => ({
            ...prev,
            replies: [...prev.replies, replyData]
          }));
          setNewReply("");
        }
      } catch (err) {
        console.error('Error posting reply:', err);
      }
    }
  };

  const toggleLike = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${post.id}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPost(prev => ({
          ...prev,
          likes: data.likes
        }));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <div
    style={{
        width: "100vw",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#333",
        color: "#fff",
        padding: "40px",
        overflowY: "auto",
        width: "100vw",
        minHeight: "30vw",
        boxSizing: "border-box",
    }}
    >


    
    <div
      style={{
        flex: 1,
        backgroundColor: "#333",
        color: "#fff",
        padding: "40px",
        overflowY: "auto",
        width: "50vw",
      }}
    >
      <button
        onClick={() => navigate("/communities")}
        style={{
          backgroundColor: "#666",
          border: "none",
          borderRadius: "4px",
          padding: "6px 12px",
          color: "#fff",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← Back to Communities
      </button>

      <div
        style={{
          backgroundColor: "#444",
          border: "1px solid #555",
          borderRadius: "10px",
          padding: "25px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginBottom: "5px" }}>{post.title}</h2>
        <p style={{ color: "#bbb", marginBottom: "10px" }}>
          <em>by {post.author}</em> — <span>{post.category}</span>
        </p>
        <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>{post.content}</p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: post.liked ? "#00bfff" : "#aaa",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          onClick={toggleLike}
        >
          {post.liked ? <AiFillLike /> : <AiOutlineLike />}
          <span>{post.likes}</span>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#444",
          border: "1px solid #555",
          borderRadius: "10px",
          padding: "25px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#00bfff" }}>Replies ({post.replies.length})</h3>
        
        {post.replies.length === 0 ? (
          <p style={{ color: "#aaa", marginBottom: "20px" }}>No replies yet. Be the first to comment!</p>
        ) : (
          <div style={{ marginBottom: "20px" }}>
            {post.replies.map((reply) => (
              <div
                key={reply.id}
                style={{
                  backgroundColor: "#555",
                  marginBottom: "10px",
                  padding: "15px",
                  borderRadius: "6px",
                }}
              >
                <strong style={{ color: "#00bfff" }}>{reply.user}</strong>:{" "}
                <span>{reply.text}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleReply}>
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write your reply..."
            style={{
              width: "100%",
              minHeight: "80px",
              backgroundColor: "#555",
              border: "1px solid #666",
              borderRadius: "6px",
              padding: "10px",
              color: "#fff",
              fontSize: "14px",
              resize: "vertical",
              marginBottom: "10px",
            }}
          />
          <button
            type="submit"
            disabled={!newReply.trim()}
            style={{
              backgroundColor: newReply.trim() ? "#00bfff" : "#666",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              color: "#fff",
              cursor: newReply.trim() ? "pointer" : "not-allowed",
              fontSize: "14px",
            }}
          >
            Post Reply
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default PostDetail;
