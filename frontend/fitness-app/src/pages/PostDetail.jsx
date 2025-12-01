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
          backgroundColor: "#000",
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
          backgroundColor: "#000",
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
            backgroundColor: "#1abc9c",
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
          backgroundColor: "#000",
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
    if (!idToken) {
      alert('Please login to like posts');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${post.id}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPost(prev => ({
          ...prev,
          likes: data.likes,
          liked: data.liked
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
        backgroundColor: "#000",
        color: "#fff",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        justifyContent: "center",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          padding: "40px",
          minHeight: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
      <button
        onClick={() => navigate("/communities")}
        style={{
          backgroundColor: "#222",
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
          backgroundColor: "#141414",
          border: "2px solid #1abc9c",
          borderRadius: "10px",
          padding: "25px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "5px", gap: "10px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, flex: "1 1 auto", minWidth: 0, wordWrap: "break-word", overflowWrap: "break-word" }}>{post.title}</h2>
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
            color: post.liked ? "#1abc9c" : "#aaa",
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
          backgroundColor: "#141414",
          border: "2px solid #1abc9c",
          borderRadius: "10px",
          padding: "25px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#1abc9c" }}>Replies ({post.replies.length})</h3>
        
        {post.replies.length === 0 ? (
          <p style={{ color: "#aaa", marginBottom: "20px" }}>No replies yet. Be the first to comment!</p>
        ) : (
          <div style={{ marginBottom: "20px" }}>
            {post.replies.map((reply) => (
              <div
                key={reply.id}
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  marginBottom: "10px",
                  padding: "15px",
                  borderRadius: "6px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: "#1abc9c" }}>{reply.user}</strong>:{" "}
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
              backgroundColor: "#0a0a0a",
              border: "1px solid #333",
              borderRadius: "6px",
              padding: "10px",
              color: "#fff",
              fontSize: "14px",
              resize: "vertical",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            disabled={!newReply.trim()}
            style={{
              backgroundColor: newReply.trim() ? "#1abc9c" : "#222",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              color: newReply.trim() ? "#000" : "#fff",
              fontWeight: newReply.trim() ? "bold" : "normal",
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
