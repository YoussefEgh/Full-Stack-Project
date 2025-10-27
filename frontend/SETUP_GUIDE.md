# Full-Stack Fitness Application

A full-stack fitness tracking application built with Django REST Framework and React, using Firebase Authentication and Cloud Firestore for data storage.

## 🚀 Features

- **User Authentication**: Firebase Authentication with email/password
- **Communities**: Discussion forums for fitness topics (Supplements, Exercises, Nutrition, General)
- **Workout Tracking**: Track and manage workout progress
- **Progress Tracking**: Monitor fitness progress over time
- **Custom Priority Queue**: Server-side sorting of posts by latest or most liked

## 📋 Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 20.19+ or 22.12+ (Vite requires newer Node versions)
- **Firebase Project**: You'll need to set up a Firebase project
- **Git**: For cloning the repository

## 🔧 Backend Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Full-Stack-Project
```

### 2. Set Up Python Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** → Enable Email/Password provider
4. Enable **Cloud Firestore** → Create database (start in test mode)
5. Go to **Project Settings** → **Service Accounts**
6. Click **Generate New Private Key** → Download the JSON file
7. Save the JSON file in the `backend/` directory

### 5. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp env.example .env
```

Edit `.env` with your Firebase credentials path:

```env
FIREBASE_CREDENTIALS_PATH=your-firebase-credentials.json
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### 6. Set Firestore Security Rules

In Firebase Console → Firestore → Rules, use:

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

### 7. Run the Backend Server

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

The backend will run on `http://localhost:8000`

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend/fitness-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase for Frontend

1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Copy the Firebase configuration

Create/update `src/config/firebase.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

Replace the placeholder values with your actual Firebase config.

### 4. Run the Frontend

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🧪 Testing the Setup

### Create Sample Data

To populate the database with sample posts:

```bash
cd backend
source venv/bin/activate
python create_sample_post.py
python create_more_samples.py
```

### Test User Registration

1. Open `http://localhost:5173/register`
2. Create a new account
3. You should be redirected to settings page

### Test Communities

1. Go to Communities page
2. You should see sample posts
3. Create a new post or reply to existing ones
4. Try sorting by "Latest" or "Most Liked"

## 🐛 Troubleshooting

### Backend Issues

**"Firebase not initialized" error:**
- Check that `.env` file has correct `FIREBASE_CREDENTIALS_PATH`
- Verify the JSON file exists and is valid

**"Port already in use" error:**
```bash
pkill -f "python manage.py runserver"
```

### Frontend Issues

**Node.js version error:**
- Upgrade Node.js to version 20.19+ or 22.12+

**"Invalid API key" error:**
- Check Firebase configuration in `src/config/firebase.js`
- Verify Firebase project is active

### Common Issues

**No posts showing:**
- Firestore is empty by default
- Create sample data using the scripts above
- Or create posts through the UI

**CORS errors:**
- Verify backend CORS settings in `config/settings.py`
- Make sure frontend URL is in `CORS_ALLOWED_ORIGINS`

## 📁 Project Structure

```
Full-Stack-Project/
├── backend/
│   ├── config/               # Django config
│   │   ├── firebase.py       # Firebase initialization
│   │   └── data_structures/  # Custom PriorityQueue
│   ├── authentication/       # Auth views and services
│   ├── communities/          # Posts and replies
│   ├── progress/             # Workout tracking
│   └── .env                  # Environment variables
│
└── frontend/
    └── fitness-app/
        ├── src/
        │   ├── config/       # Firebase config
        │   ├── contexts/     # Auth context
        │   └── pages/        # React components
        └── package.json
```

## 🔑 Key Technologies

### Backend:
- Django 5.2.7
- Django REST Framework
- Firebase Admin SDK
- Custom PriorityQueue implementation

### Frontend:
- React 19.1.1
- Firebase SDK 12.4.0
- Vite
- React Router

### Database:
- Cloud Firestore (NoSQL)

## 📝 Important Notes

- This project uses Firebase for both authentication and database
- all data is stored in Firestore
- User authentication uses Firebase ID tokens
- Posts are sorted using a custom PriorityQueue implementation

## 🎯 Available Scripts

### Backend:
```bash
python manage.py runserver          # Start development server
python create_sample_post.py        # Create post with replies
python create_more_samples.py       # Create multiple posts
python update_post_dates.py         # Update post dates
python test_firestore.py            # Create test post
```

### Frontend:
```bash
npm run dev                         # Start development server
npm run build                       # Build for production
```

## 📧 Support

For issues or questions:
1. Check Firebase Console for service status
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check browser console and backend terminal for errors

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Firebase credentials configured
- [ ] Firebase services enabled (Auth + Firestore)
- [ ] Can register new users
- [ ] Can login with existing users
- [ ] Communities page shows posts
- [ ] Can create posts and replies

## 🎉 You're All Set!

Your fitness application is ready to use. Happy coding!
