# Full-Stack Fitness Application

A fitness tracking and social application built with Django REST Framework and React. The application allows users to track workouts, monitor progress, connect with other fitness enthusiasts through communities, and discover new exercises.

## Demo Video

[![Demo Video](https://img.youtube.com/vi/vi9eDmeTa28/0.jpg)](https://youtu.be/vi9eDmeTa28)

Watch the full demo: https://youtu.be/vi9eDmeTa28

## Main Functionality

The application provides several core features:

**User Authentication**: Secure registration and login using Firebase Authentication with email and password.

**Progress Tracking**: Users can log workout sessions by creating workout days and adding exercises with sets, reps, and weight. The system tracks progress over time and provides autocomplete suggestions for exercise names.

**Workout Discovery**: Integration with ExerciseDB API allows users to search and discover exercises based on muscle groups, equipment, and target areas. Users can view exercise details including instructions and tips.

**Communities**: Discussion forums organized by topics including Supplements, Exercises, Nutrition, and General fitness discussions. Users can create posts, reply to posts, and like content. Posts can be sorted by latest or most liked using a custom priority queue implementation.

**Clusters**: Social graph feature that helps users find and connect with other users who have similar fitness interests and goals.

**Settings**: User profile management including personal information, measurement preferences, and data export capabilities.

## Prerequisites

Before running the application, ensure you have the following installed:

- Python 3.9 or higher
- Node.js 20.19+ or 22.12+
- Firebase project with Authentication and Firestore enabled
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YoussefEgh/Full-Stack-Project.git
cd Full-Stack-Project
```

### 2. Backend Setup

Navigate to the backend directory and create a virtual environment:

```bash
cd backend
python3 -m venv venv
```

Activate the virtual environment:

On Linux/Mac:
```bash
source venv/bin/activate
```

On Windows:
```bash
venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Firebase Configuration

Create a Firebase project at https://console.firebase.google.com/ and enable the following services:

- Authentication: Enable Email/Password provider
- Firestore Database: Create database in test mode

Download the Firebase service account key:

1. Go to Firebase Console
2. Click the gear icon next to Project Overview
3. Select Project settings
4. Go to Service accounts tab
5. Click Generate new private key
6. Save the downloaded JSON file in the `backend/` directory

Create a `.env` file in the `backend/` directory:

```env
FIREBASE_CREDENTIALS_PATH=your-firebase-credentials.json
SECRET_KEY=your-random-secret-key-here
DEBUG=True
```

Replace `your-firebase-credentials.json` with the actual filename of your downloaded JSON file. Generate a secret key using:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Set Firestore security rules in Firebase Console:

1. Go to Firestore Database
2. Click Rules tab
3. Paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    match /replies/{replyId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    match /workout_progress/{workoutId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
```

4. Click Publish

Run Django migrations:

```bash
python manage.py migrate
```

### 4. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend/fitness-app
```

Install Node.js dependencies:

```bash
npm install
```

Configure Firebase for the frontend:

1. Go to Firebase Console
2. Click the gear icon and select Project settings
3. Scroll to Your apps section
4. Click the web icon to add a web app if you haven't already
5. Copy the Firebase configuration object

Edit `src/config/firebase.js` and replace the configuration with your Firebase project values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Ensure the projectId matches the same Firebase project used for the backend.

## Running the Application

The application requires both backend and frontend servers to be running simultaneously.

### Start Backend Server

Open a terminal and run:

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

The backend will start on http://127.0.0.1:8000

### Start Frontend Server

Open a second terminal and run:

```bash
cd frontend/fitness-app
npm run dev
```

The frontend will start on http://localhost:5173

### Access the Application

Open your web browser and navigate to:

```
http://localhost:5173
```

You should see the application homepage. Register a new account to get started.

## Troubleshooting

**ModuleNotFoundError**: Ensure the virtual environment is activated. You should see `(venv)` in your terminal prompt.

**Port already in use**: If port 8000 or 5173 is in use, kill the existing process:

```bash
pkill -f "python manage.py runserver"
lsof -ti:5173 | xargs kill -9
```

**Firebase not initialized**: Verify that the `.env` file exists in the backend directory and contains the correct path to your Firebase credentials file. Also check that `src/config/firebase.js` has the correct Firebase configuration.

**CORS errors**: Ensure both servers are running and the backend CORS settings allow `http://localhost:5173`.

**Login errors**: Make sure both backend and frontend servers are running. Check the browser console and backend terminal for error messages.

## Project Structure

```
Full-Stack-Project/
├── backend/
│   ├── config/              # Django configuration
│   ├── authentication/      # User authentication
│   ├── communities/         # Posts and replies
│   ├── progress/            # Workout tracking
│   ├── .env                 # Environment variables
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    └── fitness-app/
        ├── src/
        │   ├── config/      # Firebase configuration
        │   ├── contexts/    # React contexts
        │   └── pages/       # React components
        └── package.json     # Node dependencies
```

## Technologies Used

- Backend: Django 5.2.7, Django REST Framework, Firebase Admin SDK
- Frontend: React 19.1.1, Firebase SDK, Vite, React Router
- Database: Cloud Firestore
- External APIs: ExerciseDB API for exercise data
