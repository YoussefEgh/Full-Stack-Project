import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const WORKOUT_TYPES = [
  { value: 'upper', label: 'Upper Body' },
  { value: 'lower', label: 'Lower Body' },
  { value: 'push', label: 'Push' },
  { value: 'pull', label: 'Pull' },
  { value: 'legs', label: 'Legs' },
  { value: 'regular', label: 'Regular Workout' }
];

const ProgressContent = () => {
  const { idToken } = useAuth();
  const [workoutDays, setWorkoutDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null); // {dayId, exerciseId, exercise}
  const [newDayForm, setNewDayForm] = useState({
    date: (() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(),
    workout_type: 'regular'
  });
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    reps: '',
    sets: '',
    weight: ''
  });
  const [exerciseSuggestions, setExerciseSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if we've searched and got no results
  const debounceTimeoutRef = useRef(null);

  const API_BASE = 'http://127.0.0.1:8000/api/progress';

  useEffect(() => {
    fetchWorkoutDays();
  }, [idToken]);

  const fetchWorkoutDays = async () => {
    if (!idToken) {
        setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/days/`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to fetch workout days: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched workout days:', data);
      setWorkoutDays(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch workout days. Make sure the backend server is running.';
      setError(errorMessage);
      console.error('Error fetching workout days:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDay = async (e) => {
    e.preventDefault();
    if (!idToken) {
      setError('Not authenticated - Please log in again');
      console.error('No idToken available');
      return;
    }

    console.log('Creating workout day with data:', newDayForm);
    console.log('API endpoint:', `${API_BASE}/days/`);
    console.log('Token present:', !!idToken);

    try {
      const response = await fetch(`${API_BASE}/days/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(newDayForm)
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to create workout day: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Workout day created:', data);
      
      // Close modal and reset form first
      setShowAddDayModal(false);
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setNewDayForm({
        date: `${year}-${month}-${day}`,
        workout_type: 'regular'
      });
      setError(null);
      
      // Refresh immediately - Firestore writes are synchronous
      await fetchWorkoutDays();
    } catch (err) {
      const errorMessage = err.message || 'Failed to create workout day. Make sure the backend server is running.';
      setError(errorMessage);
      console.error('Error creating workout day:', err);
    }
  };

  const handleDeleteDay = async (dayId) => {
    if (!confirm('Delete this workout day?')) return;
    if (!idToken) return;

    try {
      const response = await fetch(`${API_BASE}/days/${dayId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete workout day');
      await fetchWorkoutDays();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting workout day:', err);
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!idToken || !selectedDayId) return;

    try {
      const response = await fetch(`${API_BASE}/days/${selectedDayId}/exercises/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: exerciseForm.name,
          reps: parseInt(exerciseForm.reps),
          sets: parseInt(exerciseForm.sets),
          weight: parseFloat(exerciseForm.weight)
        })
      });

      if (!response.ok) throw new Error('Failed to add exercise');
      
      await fetchWorkoutDays();
      setShowExerciseModal(false);
      setExerciseForm({ name: '', reps: '', sets: '', weight: '' });
      setSelectedDayId(null);
      setEditingExercise(null);
      setError(null);
    } catch (err) {
        setError(err.message);
      console.error('Error adding exercise:', err);
    }
  };

  const handleDeleteExercise = async (dayId, exerciseId) => {
    if (!confirm('Delete this exercise?')) return;
    if (!idToken) return;

    try {
      const response = await fetch(`${API_BASE}/days/${dayId}/exercises/${exerciseId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete exercise');
      await fetchWorkoutDays();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting exercise:', err);
    }
  };

  const handleEditExercise = (dayId, exercise) => {
    setEditingExercise({ dayId, exerciseId: exercise.id, exercise });
    setExerciseForm({
      name: exercise.name,
      reps: exercise.reps.toString(),
      sets: exercise.sets.toString(),
      weight: exercise.weight.toString()
    });
    setShowExerciseModal(true);
  };

  const handleUpdateExercise = async (e) => {
    e.preventDefault();
    if (!idToken || !editingExercise) return;

    try {
      const response = await fetch(`${API_BASE}/days/${editingExercise.dayId}/exercises/${editingExercise.exerciseId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: exerciseForm.name,
          reps: parseInt(exerciseForm.reps),
          sets: parseInt(exerciseForm.sets),
          weight: parseFloat(exerciseForm.weight)
        })
      });

      if (!response.ok) throw new Error('Failed to update exercise');
      
      await fetchWorkoutDays();
      setShowExerciseModal(false);
      setEditingExercise(null);
      setExerciseForm({ name: '', reps: '', sets: '', weight: '' });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error updating exercise:', err);
    }
  };

  const formatDate = (dateString) => {
    // Parse the date string (YYYY-MM-DD) directly to avoid timezone conversion issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWorkoutTypeLabel = (type) => {
    const workout = WORKOUT_TYPES.find(w => w.value === type);
    return workout ? workout.label : type;
  };

  const openExerciseModal = (dayId) => {
    setSelectedDayId(dayId);
    setEditingExercise(null); // Clear any editing state
    setShowExerciseModal(true);
    setExerciseForm({ name: '', reps: '', sets: '', weight: '' });
    setExerciseSuggestions([]);
    setShowSuggestions(false);
    setHasSearched(false); // Reset search flag when opening modal
  };

  const fetchExerciseSuggestions = async (prefix) => {
    if (!prefix || prefix.length < 2) {
      setExerciseSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!idToken) return;

    try {
      setSuggestionLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/progress/exercises/autocomplete/?q=${encodeURIComponent(prefix)}&limit=8`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Autocomplete response:', data);
        const suggestions = data.suggestions || [];
        setExerciseSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
        setHasSearched(true); // Mark that we've completed a search
        console.log('Suggestions set:', suggestions, 'Show:', suggestions.length > 0);
      } else {
        const errorText = await response.text();
        console.error('Autocomplete error response:', response.status, errorText);
        setExerciseSuggestions([]);
        setShowSuggestions(false);
        setHasSearched(true); // Mark that we've completed a search (even if it failed)
      }
    } catch (err) {
      console.error('Error fetching exercise suggestions:', err);
      setExerciseSuggestions([]);
      setShowSuggestions(false);
      setHasSearched(true); // Mark that we've completed a search (even if it errored)
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleExerciseNameChange = (e) => {
    const value = e.target.value;
    setExerciseForm({ ...exerciseForm, name: value });
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce the autocomplete request
    if (value.length >= 2) {
      setHasSearched(false); // Reset search flag when user types
      debounceTimeoutRef.current = setTimeout(() => {
        fetchExerciseSuggestions(value);
      }, 300); // 300ms debounce
    } else {
      setExerciseSuggestions([]);
      setShowSuggestions(false);
      setSuggestionLoading(false);
      setHasSearched(false); // Reset search flag when input is cleared
    }
  };

  const selectSuggestion = (suggestion) => {
    setExerciseForm({ ...exerciseForm, name: suggestion });
    setExerciseSuggestions([]);
    setShowSuggestions(false);
    setSuggestionLoading(false); // Also clear loading state
    setHasSearched(false); // Reset search flag so "no suggestions found" doesn't show
  };

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      height: "100%",
      backgroundColor: "#000",
      color: "#fff",
      padding: "40px",
      overflowX: "hidden",
      overflowY: "auto",
      boxSizing: "border-box"
    }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ marginBottom: "10px" }}>🏋️ Your Progress</h1>
        <p style={{ marginBottom: "20px", color: "#ccc" }}>
          Track your workouts by day and see your progress over time.
        </p>
        <button
          onClick={() => setShowAddDayModal(true)}
          style={{
            backgroundColor: "#1abc9c",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            color: "#000",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#16a085"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1abc9c"}
        >
          ➕ Add New Workout Day
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: "#ff6b6b",
          color: "#fff",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <div>Loading workout days...</div>
      ) : workoutDays.length === 0 ? (
        <div style={{
          background: "linear-gradient(135deg, #111, #0a0a0a)",
          border: "1px solid #222",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          color: "#aaa"
        }}>
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>No workout days yet</p>
          <p>Click "Add New Workout Day" to get started!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {workoutDays.map((day) => (
            <div
              key={day.id}
              style={{
                background: "linear-gradient(135deg, #111, #0a0a0a)",
                border: "2px solid #1abc9c",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "24px", marginBottom: "8px" }}>
                    {formatDate(day.date)}
                  </h2>
                  <span style={{
                    backgroundColor: "#1abc9c",
                    color: "#000",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}>
                    {getWorkoutTypeLabel(day.workout_type)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => openExerciseModal(day.id)}
                    style={{
                      backgroundColor: "#1abc9c",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 16px",
                      color: "#000",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold"
                    }}
                  >
                    ➕ Add Exercise
                  </button>
                  <button
                    onClick={() => handleDeleteDay(day.id)}
                    style={{
                      backgroundColor: "#ff6b6b",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 16px",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {day.exercises && day.exercises.length > 0 ? (
                <div style={{
                  backgroundColor: "#141414",
                  border: "1px solid #242424",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "16px"
                }}>
                  <p style={{ color: "#aaa", marginBottom: "12px", fontSize: "14px" }}>
                    {day.exercises.length} exercise{day.exercises.length !== 1 ? 's' : ''} completed
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {day.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        style={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #333",
                          padding: "12px",
                          borderRadius: "6px",
                          flex: "1 1 200px",
                          minWidth: "200px"
                        }}
                      >
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          marginBottom: "8px"
                        }}>
                          <strong style={{ fontSize: "16px" }}>{exercise.name}</strong>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button
                              onClick={() => handleEditExercise(day.id, exercise)}
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#1abc9c",
                                cursor: "pointer",
                                fontSize: "16px",
                                padding: "0 4px",
                                display: "flex",
                                alignItems: "center"
                              }}
                              title="Edit exercise"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteExercise(day.id, exercise.id)}
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#ff6b6b",
                                cursor: "pointer",
                                fontSize: "16px",
                                padding: "0",
        display: "flex",
        alignItems: "center"
                              }}
                              title="Delete exercise"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <div style={{ color: "#aaa", fontSize: "14px" }}>
                          {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight} lbs
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: "#141414",
                  border: "1px solid #242424",
                  borderRadius: "8px",
                  padding: "20px",
                  marginTop: "16px",
                  textAlign: "center",
                  color: "#777"
                }}>
                  No exercises added yet. Click "Add Exercise" to get started!
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Day Modal */}
      {showAddDayModal && (
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
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddDayModal(false);
            }
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #111, #0a0a0a)",
          border: "1px solid #222",
              borderRadius: "12px",
              padding: "30px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "20px", color: "#1abc9c" }}>Add New Workout Day</h2>
            <form onSubmit={handleAddDay}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#ccc", fontWeight: "bold" }}>
                  Date
                </label>
                <input
                  type="date"
                  value={newDayForm.date}
                  onChange={(e) => setNewDayForm({ ...newDayForm, date: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #333",
                    backgroundColor: "#0a0a0a",
                    color: "#fff",
                    fontSize: "16px"
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#ccc", fontWeight: "bold" }}>
                  Workout Type
                </label>
                <select
                  value={newDayForm.workout_type}
                  onChange={(e) => setNewDayForm({ ...newDayForm, workout_type: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #333",
                    backgroundColor: "#0a0a0a",
                    color: "#fff",
                    fontSize: "16px"
                  }}
                >
                  {WORKOUT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowAddDayModal(false)}
                  style={{
                    backgroundColor: "#666",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 20px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#00bfff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 20px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                >
                  Create Day
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Exercise Modal */}
      {showExerciseModal && (selectedDayId || editingExercise) && (
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
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowExerciseModal(false);
              setSelectedDayId(null);
              setEditingExercise(null);
              setExerciseForm({ name: '', reps: '', sets: '', weight: '' });
              setExerciseSuggestions([]);
              setShowSuggestions(false);
              setHasSearched(false); // Reset search flag when modal closes
            }
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #111, #0a0a0a)",
              border: "2px solid #1abc9c",
              borderRadius: "12px",
              padding: "30px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
              boxSizing: "border-box"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "20px", color: "#1abc9c", marginTop: 0 }}>
              {editingExercise ? "Edit Exercise" : "Add Exercise"}
            </h2>
            <form onSubmit={editingExercise ? handleUpdateExercise : handleAddExercise} style={{ width: "100%" }}>
              <div style={{ marginBottom: "20px", position: "relative" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#ccc", fontWeight: "bold" }}>
                  Exercise Name
                </label>
        <input
          type="text"
                  value={exerciseForm.name}
                  onChange={handleExerciseNameChange}
                  onFocus={() => {
                    if (exerciseForm.name.length >= 2 && exerciseSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicking on them
                    setTimeout(() => {
                      setShowSuggestions(false);
                      setHasSearched(false); // Reset search flag when input loses focus
                    }, 250);
                  }}
          required
                  placeholder="e.g., Bench Press (start typing for suggestions)"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #333",
                    backgroundColor: "#0a0a0a",
                    color: "#fff",
                    fontSize: "16px",
                    boxSizing: "border-box"
                  }}
                />
                {suggestionLoading && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    padding: "10px",
                    backgroundColor: "#000",
                    border: "1px solid #222",
                    borderRadius: "6px",
                    marginTop: "4px",
                    color: "#aaa",
                    fontSize: "14px",
                    zIndex: 1001
                  }}>
                    Loading suggestions...
                  </div>
                )}
                {!suggestionLoading && showSuggestions && exerciseSuggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "#000",
                      border: "1px solid #222",
                      borderRadius: "6px",
                      marginTop: "4px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 1001,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                    }}
                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur when clicking dropdown
                  >
                    {exerciseSuggestions.map((suggestion, index) => (
                      <div
                        key={`${suggestion}-${index}`}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          selectSuggestion(suggestion);
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: index < exerciseSuggestions.length - 1 ? "1px solid #222" : "none",
                          color: "#fff",
                          transition: "background-color 0.2s",
                          fontSize: "14px"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#222")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
                {!suggestionLoading && !showSuggestions && hasSearched && exerciseForm.name.length >= 2 && exerciseSuggestions.length === 0 && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    padding: "10px",
                    backgroundColor: "#000",
                    border: "1px solid #222",
                    borderRadius: "6px",
                    marginTop: "4px",
                    color: "#aaa",
                    fontSize: "14px",
                    zIndex: 1001
                  }}>
                    No suggestions found
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#ccc", fontWeight: "bold" }}>
                    Sets
                  </label>
        <input
          type="number"
                    value={exerciseForm.sets}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, sets: e.target.value })}
          required
                    min="1"
                    placeholder="3"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #333",
                      backgroundColor: "#0a0a0a",
                      color: "#fff",
                      fontSize: "16px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#ccc", fontWeight: "bold" }}>
                    Reps
                  </label>
        <input
          type="number"
                    value={exerciseForm.reps}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
          required
                    min="1"
                    placeholder="10"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #333",
                      backgroundColor: "#0a0a0a",
                      color: "#fff",
                      fontSize: "16px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#ccc", fontWeight: "bold" }}>
                    Weight (lbs)
                  </label>
        <input
          type="number"
                    value={exerciseForm.weight}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, weight: e.target.value })}
          required
                    min="0"
                    step="0.5"
                    placeholder="50"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #333",
                      backgroundColor: "#0a0a0a",
                      color: "#fff",
                      fontSize: "16px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowExerciseModal(false);
                    setSelectedDayId(null);
                    setEditingExercise(null);
                    setExerciseForm({ name: '', reps: '', sets: '', weight: '' });
                    setExerciseSuggestions([]);
                    setShowSuggestions(false);
                    setHasSearched(false);
                  }}
                  style={{
                    backgroundColor: "#ff6b6b",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 20px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#1abc9c",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 20px",
                    color: "#000",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                >
                  {editingExercise ? "Update Exercise" : "Add Exercise"}
        </button>
              </div>
      </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressContent;
