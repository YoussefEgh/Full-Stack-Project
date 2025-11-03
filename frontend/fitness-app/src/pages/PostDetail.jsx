import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { useAuth } from "../contexts/AuthContext";

function PostDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { idToken, user } = useAuth();
  const [newReply, setNewReply] = useState("");
  const [post, setPost] = useState(state?.post);
  const [loading, setLoading] = useState(!state?.post);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!state?.post && id) {
      fetchPost();
    }
  }, [id, state?.post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const headers = {};
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${id}/`, {
        headers
      });
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Post not found.</p>
      </div>
    );
  }

  const handleReply = async (e) => {
    e.preventDefault();
    if (!idToken) {
      alert('Please login to reply');
      return;
    }
    if (newReply.trim()) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${post.id}/replies/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            text: newReply.trim(),
          }),
        });
        
        if (response.ok) {
          const replyData = await response.json();
          setPost(prev => ({
            ...prev,
            replies: [...(prev.replies || []), replyData]
          }));
          setNewReply("");
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to post reply');
        }
      } catch (err) {
        console.error('Error posting reply:', err);
        alert('Error posting reply. Please try again.');
      }
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleting(true);
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${post.id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        }
      });
      
      if (response.ok) {
        navigate("/communities");
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Error deleting post. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/communities/replies/${replyId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        }
      });
      
      if (response.ok) {
        setPost(prev => ({
          ...prev,
          replies: prev.replies.filter(r => r.id !== replyId)
        }));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete reply');
      }
    } catch (err) {
      console.error('Error deleting reply:', err);
      alert('Error deleting reply. Please try again.');
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
        flex: 1,
        backgroundColor: "#333",
        color: "#fff",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "85vw",
          padding: "40px",
          minHeight: "30vw",
          boxSizing: "border-box",
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "5px" }}>
          <h2 style={{ margin: 0, flex: 1 }}>{post.title}</h2>
          {post.author_uid === user?.uid && (
            <button
              onClick={handleDeletePost}
              disabled={deleting}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: deleting ? "not-allowed" : "pointer",
                color: "#ff6b6b",
                fontSize: "20px",
                padding: "0",
                opacity: deleting ? 0.5 : 1,
              }}
              title="Delete post"
            >
              <AiOutlineDelete />
            </button>
          )}
        </div>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: "#00bfff" }}>{reply.user}</strong>:{" "}
                    <span>{reply.text}</span>
                  </div>
                  {reply.user_uid === user?.uid && (
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#ff6b6b",
                        fontSize: "18px",
                        padding: "0 5px",
                      }}
                      title="Delete reply"
                    >
                      <AiOutlineDelete />
                    </button>
                  )}
                </div>
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
