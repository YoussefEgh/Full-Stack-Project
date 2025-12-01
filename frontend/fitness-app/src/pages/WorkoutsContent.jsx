import ExerciseCard from "./ExerciseCard";
import { useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";

const WorkoutContent = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: 'bench', // general search query
    bodyPart: '',
    equipment: '',
    target: ''
  });

  // Fetch exercises from backend API
  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.bodyPart) params.append('bodyPart', filters.bodyPart);
      if (filters.equipment) params.append('equipment', filters.equipment);
      if (filters.target) params.append('target', filters.target);
      
      const queryString = params.toString();
      const url = queryString 
        ? `http://localhost:8000/api/exercises/?${queryString}`
        : 'http://localhost:8000/api/exercises/';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setExercises(data.exercises);
      } else {
        throw new Error(data.error || 'Failed to fetch exercises');
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err.message);
      // Fallback to mock data if API fails
      setExercises([
        { 
          exerciseId: '1', 
          name: 'Push-ups', 
          bodyParts: ['chest'], 
          equipments: ['body weight'], 
          targetMuscles: ['pectorals'],
          secondaryMuscles: ['triceps', 'shoulders'],
          gifUrl: 'https://example.com/pushup.gif',
          instructions: [
            'Step:1 Start in a plank position with your hands slightly wider than shoulder-width apart.',
            'Step:2 Lower your body until your chest nearly touches the floor.',
            'Step:3 Push yourself back up to the starting position.',
            'Step:4 Repeat for the desired number of repetitions.'
          ]
        },
        { 
          exerciseId: '2', 
          name: 'Squats', 
          bodyParts: ['upper legs'], 
          equipments: ['body weight'], 
          targetMuscles: ['quadriceps'],
          secondaryMuscles: ['glutes', 'hamstrings'],
          gifUrl: 'https://example.com/squat.gif',
          instructions: [
            'Step:1 Stand with your feet shoulder-width apart.',
            'Step:2 Lower your body by bending your knees and pushing your hips back.',
            'Step:3 Go down until your thighs are parallel to the floor.',
            'Step:4 Push through your heels to return to the starting position.'
          ]
        },
        { 
          exerciseId: '3', 
          name: 'Plank', 
          bodyParts: ['waist'], 
          equipments: ['body weight'], 
          targetMuscles: ['abs'],
          secondaryMuscles: ['core', 'shoulders'],
          gifUrl: 'https://example.com/plank.gif',
          instructions: [
            'Step:1 Start in a push-up position.',
            'Step:2 Lower down to your forearms.',
            'Step:3 Keep your body in a straight line from head to heels.',
            'Step:4 Hold this position for the desired duration.'
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exercises on component mount and when filters change
  useEffect(() => {
    fetchExercises();
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      bodyPart: '',
      equipment: '',
      target: ''
    });
  };

  return (
    <div style={{ 
      flex: 1,
      minWidth: 0,
      height: "100%",
      overflowX: "hidden",
      overflowY: "auto",        // Enable vertical scrolling to edge
      backgroundColor: "#000", 
      color: "#fff",
      padding: "45px 0",         // vertical padding only
      boxSizing: "border-box",
      maxWidth: "100%"
    }}>
      <h1 style={{ marginBottom: "10px", padding: "0 35px" }}>💪 Your Workouts</h1>
      <p style={{ marginBottom: "20px", color: "#ccc", padding: "0 35px" }}>
        Browse exercises from the ExerciseDB database!
      </p>

      {/* Filter Controls */}
      <div style={{ 
        padding: "20px 35px", 
        background: "linear-gradient(135deg, #111, #0a0a0a)",
        border: "2px solid #1abc9c",
        margin: "20px 20px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <h4 style={{ marginBottom: "15px", color: "#fff", marginTop: "0" }}>Search & Filter Exercises</h4>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Search:</label>
            <input
              type="text"
              placeholder="e.g., shoulders, push ups, chest"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #333",
                backgroundColor: "#0a0a0a",
                color: "#fff",
                width: "200px"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Body Part:</label>
            <input
              type="text"
              placeholder="e.g., chest, back, legs"
              value={filters.bodyPart}
              onChange={(e) => handleFilterChange('bodyPart', e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #333",
                backgroundColor: "#0a0a0a",
                color: "#fff",
                width: "150px"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Equipment:</label>
            <input
              type="text"
              placeholder="e.g., body weight, dumbbell"
              value={filters.equipment}
              onChange={(e) => handleFilterChange('equipment', e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #333",
                backgroundColor: "#0a0a0a",
                color: "#fff",
                width: "150px"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Target:</label>
            <input
              type="text"
              placeholder="e.g., pectorals, biceps"
              value={filters.target}
              onChange={(e) => handleFilterChange('target', e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #333",
                backgroundColor: "#0a0a0a",
                color: "#fff",
                width: "150px"
              }}
            />
          </div>
          <button
            onClick={clearFilters}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1abc9c",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "20px",
              fontWeight: "bold"
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ 
          padding: "40px 35px", 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          gap: "20px"
        }}>
          <FiLoader 
            style={{
              fontSize: "48px",
              color: "#1abc9c",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#aaa", margin: 0 }}>Loading exercises...</p>
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
      )}



      {/* Exercises Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "20px", 
        marginTop: "20px",
        padding: "0 20px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.exerciseId}
            exercise={exercise}
          />
        ))}
      </div>

      {/* No exercises found */}
      {!loading && exercises.length === 0 && (
        <div style={{ padding: "40px 35px", textAlign: "center" }}>
          <p style={{ color: "#aaa" }}>No exercises found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutContent;
