# ExerciseDB API Integration Setup Guide

## Overview
This guide explains how to set up the ExerciseDB API integration for the workouts functionality. The integration fetches exercise data through the backend Django API, which then communicates with the ExerciseDB.dev API (no API key required).

## Prerequisites
1. Django backend running on port 8000
2. React frontend running on port 5173
3. No API key or subscription required!

## Setup Steps

### 1. Install Required Python Packages
Make sure you have the required packages installed in your Django virtual environment:

```bash
cd backend
pip install requests
```

**Note:** No API key setup required! ExerciseDB.dev is free to use.

### 2. Start the Backend Server
```bash
cd backend
python3 manage.py runserver
```

### 3. Start the Frontend Server
```bash
cd frontend/fitness-app
npm run dev
```

## API Endpoints

The backend now provides the following ExerciseDB.dev API endpoints:

- `GET /api/exercises/` - Search exercises (with optional filters)
- `GET /api/exercises/{exercise_id}/` - Get specific exercise details
- `GET /api/exercises/body-parts/` - Get common body parts for filtering
- `GET /api/exercises/targets/` - Get common target muscles for filtering

### Query Parameters for Exercises
- `q` - General search query (e.g., "shoulders", "push ups", "chest")
- `bodyPart` - Filter by body part (e.g., "chest", "back", "legs")
- `equipment` - Filter by equipment (e.g., "body weight", "dumbbell")
- `target` - Filter by target muscle (e.g., "pectorals", "biceps")

### Example API Calls
```bash
# Search for exercises
curl http://localhost:8000/api/exercises/

# Search for shoulder exercises
curl "http://localhost:8000/api/exercises/?q=shoulders"

# Search for chest exercises
curl "http://localhost:8000/api/exercises/?q=chest"

# Search for push up exercises
curl "http://localhost:8000/api/exercises/?q=push%20ups"

# Filter by body part
curl "http://localhost:8000/api/exercises/?bodyPart=chest"

# Filter by equipment
curl "http://localhost:8000/api/exercises/?equipment=body%20weight"

# Filter by target muscle
curl "http://localhost:8000/api/exercises/?target=pectorals"
```

## Frontend Features

The updated WorkoutsContent component includes:

1. **Exercise Display**: Shows exercises in a responsive grid layout
2. **Search Functionality**: General search query for finding exercises
3. **Advanced Filtering**: Filter exercises by body part, equipment, and target muscle
4. **Loading States**: Shows loading indicator while fetching data
5. **Error Handling**: Graceful fallback to mock data if API fails
6. **Exercise Details**: Displays exercise name, body part, equipment, target, and GIF

## Troubleshooting

### Common Issues

1. **"Failed to fetch exercises" Error**
   - Check if the backend server is running on port 8000
   - Verify your internet connection
   - Check if ExerciseDB.dev is accessible

2. **CORS Errors**
   - Make sure CORS is properly configured in Django settings
   - Verify the frontend is running on the allowed origins

3. **No Exercises Displayed**
   - Check browser console for errors
   - Verify the backend API is responding correctly
   - Try the fallback mock data to test the UI
   - Try different search terms (e.g., "chest", "shoulders", "legs")

### Testing the Integration

1. **Test Backend API Directly**:
   ```bash
   curl http://localhost:8000/api/exercises/
   ```

2. **Test with Search**:
   ```bash
   curl "http://localhost:8000/api/exercises/?q=shoulders"
   ```

3. **Test with Filters**:
   ```bash
   curl "http://localhost:8000/api/exercises/?bodyPart=chest"
   ```

4. **Check Frontend**: Visit `http://localhost:5173` and navigate to the Workouts page

## Security Notes

- No API key required - ExerciseDB.dev is free to use
- Consider implementing rate limiting for production use
- All API calls are made server-side for security

## Next Steps

- Add exercise search functionality
- Implement exercise favorites/saving
- Add workout plan creation
- Integrate with user progress tracking
