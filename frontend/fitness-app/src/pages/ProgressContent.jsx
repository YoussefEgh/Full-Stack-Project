import React, { useEffect, useState } from "react";
import Card from "./Card";
// Server returns workouts already ordered by intensity; no client PQ needed.

const ProgressContent = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", weight: "", reps: "", sets: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/progress/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch progress");
        return res.json();
      })
      .then((data) => {
        // Server returns workouts ordered by intensity; use directly
        setProgressData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setForm({ name: entry.name, weight: entry.weight, reps: entry.reps, sets: entry.sets });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", weight: "", reps: "", sets: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      name: form.name,
      weight: parseFloat(form.weight),
      reps: parseInt(form.reps),
      sets: parseInt(form.sets)
    };

    const url = editingId ? `http://127.0.0.1:8000/api/progress/${editingId}/` : "http://127.0.0.1:8000/api/progress/";
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add progress");
        return res.json();
      })
      .then(() => {
        setForm({ name: "", weight: "", reps: "", sets: "" });
        setSubmitting(false);
        setEditingId(null);
        // Refresh progress data
        setLoading(true);
        fetch("http://127.0.0.1:8000/api/progress/")
          .then((res) => res.json())
          .then((data) => {
            // Server returns workouts ordered by intensity; use directly
            setProgressData(data);
            setLoading(false);
          });
      })
      .catch((err) => {
        setError(err.message);
        setSubmitting(false);
      });
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this entry?')) return;
    fetch(`http://127.0.0.1:8000/api/progress/${id}/`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete');
        // refresh
        setLoading(true);
        return fetch("http://127.0.0.1:8000/api/progress/");
      })
      .then((res) => res.json())
      .then((data) => {
        setProgressData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div style={{
      width: "100vw",
      overflowX: "hidden",
      backgroundColor: "#333",
      color: "#fff",
      padding: "45px 0",
      boxSizing: "border-box"
    }}>
      <h1 style={{ padding: "0 35px" }}>Your Progress</h1>
      <h3 style={{ color: "#aaa", padding: "0 45px" }}>Track your gains!</h3>

      <form onSubmit={handleSubmit} style={{
        background: "#222",
        padding: "20px 35px",
        borderRadius: "8px",
        margin: "20px 45px",
        display: "flex",
        gap: "15px",
        alignItems: "center"
      }}>
        <input
          name="name"
          type="text"
          placeholder="Workout Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #555" }}
        />
        <input
          name="weight"
          type="number"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #555", width: "110px" }}
        />
        <input
          name="reps"
          type="number"
          placeholder="Reps"
          value={form.reps}
          onChange={handleChange}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #555", width: "80px" }}
        />
        <input
          name="sets"
          type="number"
          placeholder="Sets"
          value={form.sets}
          onChange={handleChange}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #555", width: "80px" }}
        />
        <button type="submit" disabled={submitting} style={{ padding: "8px 18px", borderRadius: "4px", background: "#4caf50", color: "#fff", border: "none" }}>
          {submitting ? "Adding..." : "Add Progress"}
        </button>
      </form>

      {loading ? (
        <div style={{ padding: "0 45px" }}>Loading...</div>
      ) : error ? (
        <div style={{ color: "red", padding: "0 45px" }}>Error: {error}</div>
      ) : (
        <div style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          padding: "0 20px"
        }}>
          {progressData.length === 0 ? (
            <div>No progress entries yet.</div>
          ) : (
            progressData.map((entry) => (
              <Card
                key={entry.id}
                title={entry.name}
                body={`Weight: ${entry.weight}kg | Reps: ${entry.reps} | Sets: ${entry.sets}`}
                style={{ flex: 1 }}
                onEdit={() => startEdit(entry)}
                onDelete={() => handleDelete(entry.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressContent;
