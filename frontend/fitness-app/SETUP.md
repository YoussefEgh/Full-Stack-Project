# Frontend Setup Guide

## Quick Start

### 1. Prerequisites

- Node.js 20.19+ or 22.12+ (required for Vite)
- npm or yarn

### 2. Install Dependencies

```bash
cd frontend/fitness-app
npm install
```

### 3. Configure Firebase

1. Go to Firebase Console → Project Settings
2. Add a web app (</> icon)
3. Copy the Firebase configuration

4. Update `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Run Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Project Structure

```
src/
├── config/
│   └── firebase.js          # Firebase configuration
├── contexts/
│   └── AuthContext.jsx      # Authentication context
├── pages/
│   ├── Login.jsx            # Login page
│   ├── Register.jsx         # Registration page
│   ├── Communities.jsx      # Communities page
│   ├── CommunitiesContent.jsx
│   └── PostDetail.jsx       # Post detail with replies
└── components/
    ├── Layout.jsx           # Main layout
    └── ProtectedRoute.jsx   # Auth protection
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Troubleshooting

### Node Version Error

**Error:** "You are using Node.js 16.20.2. Vite requires Node.js version 20.19+"

**Solution:** Upgrade Node.js
```bash
# Using nvm
nvm install 20
nvm use 20

# Or download from nodejs.org
```

### Firebase Not Initialized

**Error:** "Firebase not initialized"

**Solution:** 
- Check `src/config/firebase.js` has valid config
- Verify API key is correct
- Check browser console for errors

### CORS Errors

**Error:** "CORS policy blocked"

**Solution:**
- Make sure backend is running on port 8000
- Verify backend CORS settings allow `http://localhost:5173`

### Blank Screen

**Error:** White screen on load

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify backend is running
4. Check if Firebase services are enabled

## Features

- ✅ Firebase Authentication
- ✅ User Registration & Login
- ✅ Communities (Posts & Replies)
- ✅ Workout Progress Tracking
- ✅ Protected Routes
- ✅ Responsive Design

## Environment Variables

No `.env` file needed for frontend in development. Firebase config is in `src/config/firebase.js`.

For production, consider using environment variables.

## Testing

Open `http://localhost:5173` and:
1. Register a new account
2. Login with that account
3. Browse communities
4. Create posts and replies

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

