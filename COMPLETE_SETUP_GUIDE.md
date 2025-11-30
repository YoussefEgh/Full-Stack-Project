# 🚀 Complete Setup Guide - Full-Stack Fitness App

**Step-by-step guide to get the project running without any login errors!**

---

## ⚠️ IMPORTANT: Read This First!

This project requires:
1. **Python 3.9+** installed
2. **Node.js 20.19+ or 22.12+** installed (check with `node --version`)
3. **Firebase project** set up (we'll do this together)
4. **Git** to clone the repository

---

## 📋 Part 1: Clone and Initial Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/YoussefEgh/Full-Stack-Project.git
cd Full-Stack-Project
```

### Step 2: Verify Prerequisites

**Check Python version:**
```bash
python3 --version
# Should show Python 3.9 or higher
```

**Check Node.js version:**
```bash
node --version
# Should show v20.19+ or v22.12+
```

If Node.js is not the right version:
- **Option 1 (Recommended):** Install nvm (Node Version Manager)
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  source ~/.bashrc  # or source ~/.zshrc
  nvm install 20
  nvm use 20
  ```
- **Option 2:** Download from [nodejs.org](https://nodejs.org/)

---

## 🔧 Part 2: Backend Setup (Django)

### Step 3: Create Python Virtual Environment

```bash
cd backend
python3 -m venv venv
```

**Activate the virtual environment:**
- **Linux/Mac:**
  ```bash
  source venv/bin/activate
  ```
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```

You should see `(venv)` at the start of your terminal prompt.

### Step 4: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**If you get errors:**
- Make sure the virtual environment is activated (you should see `(venv)`)
- On Linux, you might need: `sudo apt-get install python3-dev python3-pip`

### Step 5: Set Up Firebase Backend Credentials

**5a. Create/Login to Firebase Project:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard

**5b. Enable Firebase Services:**
1. In Firebase Console, click **Authentication** in left sidebar
2. Click **Get Started**
3. Click **Sign-in method** tab
4. Enable **Email/Password** provider (click it, toggle "Enable", Save)

**5c. Enable Firestore Database:**
1. Click **Firestore Database** in left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to you)
5. Click **Enable**

**5d. Download Service Account Key (Important for Backend):**
1. Click the ⚙️ (gear icon) next to "Project Overview" at top left
2. Click **Project settings**
3. Go to **Service accounts** tab
4. Click **Generate new private key**
5. Click **Generate key** in the popup
6. A JSON file will download - **SAVE THIS FILE!**

**5e. Add Credentials to Backend:**
1. Move the downloaded JSON file to the `backend/` directory
2. Rename it to something simple like `firebase-credentials.json`
3. Note the exact filename (you'll need it in the next step)

### Step 6: Create Backend Environment File

**Create `.env` file in the `backend/` directory:**

```bash
cd backend
nano .env
```

**OR create the file using any text editor**

**Add these lines to `.env` file (replace with YOUR values):**

```env
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
SECRET_KEY=your-random-secret-key-here-make-it-long-and-random
DEBUG=True
```

**Important:**
- Replace `firebase-credentials.json` with the actual name of your downloaded JSON file
- Replace `your-random-secret-key-here-make-it-long-and-random` with a random string (for example, run `python -c "import secrets; print(secrets.token_urlsafe(50))"` to generate one)

**Example `.env` file:**
```env
FIREBASE_CREDENTIALS_PATH=project-b5897-firebase-adminsdk-fbsvc-710dc2632a.json
SECRET_KEY=django-insecure-7+d!w+u8a(e$)5t4jzu=peq8kzxl=o&+9j!2xy%d00b-+9w-1f
DEBUG=True
```

### Step 7: Set Firestore Security Rules

**In Firebase Console:**
1. Go to **Firestore Database** → **Rules** tab
2. Copy and paste these rules:

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

3. Click **Publish**

### Step 8: Run Django Migrations

```bash
cd backend
source venv/bin/activate  # Make sure venv is activated!
python manage.py migrate
```

You should see output like:
```
Operations to perform:
  Apply all migrations: admin, auth, ...
Running migrations:
  Applying ...
```

### Step 9: Test Backend (Optional but Recommended)

**Start the backend server:**
```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

**Test in another terminal (or browser):**
```bash
curl http://127.0.0.1:8000/api/
```

If you see a response (even an error page), the backend is running!

**Press `Ctrl+C` to stop the server.**

---

## 🎨 Part 3: Frontend Setup (React)

### Step 10: Navigate to Frontend Directory

**Open a NEW terminal window** (keep backend terminal open or remember to come back to it later)

```bash
cd Full-Stack-Project/frontend/fitness-app
```

### Step 11: Configure Node.js Version (if using nvm)

```bash
source ~/.nvm/nvm.sh  # If you installed nvm
nvm use 20
```

Verify:
```bash
node --version  # Should show v20.x.x or v22.x.x
```

### Step 12: Install Frontend Dependencies

```bash
npm install
```

This may take a few minutes. Wait for it to complete.

**If you get errors:**
- Delete `node_modules` folder and `package-lock.json` (if exists)
- Run `npm install` again
- Make sure Node.js version is correct

### Step 13: Configure Firebase for Frontend

**13a. Get Firebase Web Config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click ⚙️ (gear icon) → **Project settings**
3. Scroll down to **"Your apps"** section
4. If you don't have a web app yet, click **</> (Web icon)** to add one
5. Register app (you can name it anything, like "fitness-app-web")
6. **Copy the Firebase configuration object** (it will look like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**13b. Update Frontend Firebase Config:**

Edit the file: `frontend/fitness-app/src/config/firebase.js`

Replace the `firebaseConfig` object with YOUR values from Firebase Console:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"  // Optional, only if shown
};
```

**⚠️ IMPORTANT:** Make sure the `projectId` matches the same project you used for the backend!

---

## ✅ Part 4: Running the Application

### Step 14: Start Backend Server

**Terminal 1 (Backend):**
```bash
cd Full-Stack-Project/backend
source venv/bin/activate
python manage.py runserver
```

**Keep this terminal open!** You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### Step 15: Start Frontend Server

**Terminal 2 (Frontend):**
```bash
cd Full-Stack-Project/frontend/fitness-app
npm run dev
```

**Keep this terminal open too!** You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 16: Open the Application

Open your browser and go to:
```
http://localhost:5173
```

You should see the fitness app homepage!

---

## 🧪 Part 5: Testing Login (AVOIDING ERRORS!)

### Step 17: Create a Test Account

1. In your browser, go to `http://localhost:5173/register`
2. Fill in the registration form:
   - Email: `test@example.com`
   - Password: (make it at least 6 characters)
   - Confirm Password: (same as password)
   - Other fields are optional
3. Click **Register**

**✅ If registration succeeds:**
- You'll be redirected to the settings page
- This means Firebase is configured correctly!

**❌ If you see errors:**

**Error: "Invalid API key"**
- Go back to Step 13
- Make sure you copied the Firebase config correctly from Firebase Console
- Check that `src/config/firebase.js` has the correct values

**Error: "Network error" or "Failed to fetch"**
- Make sure backend is running (check Terminal 1)
- Check that backend shows `Starting development server at http://127.0.0.1:8000/`
- Try refreshing the page

**Error: "CORS policy blocked"**
- Backend CORS should already be configured, but verify:
  - Check `backend/config/settings.py` has `CORS_ALLOWED_ORIGINS = ['http://localhost:5173']`
- Restart the backend server

### Step 18: Test Login

1. Go to `http://localhost:5173/login`
2. Enter the email and password you just registered
3. Click **Login**

**✅ If login succeeds:**
- You'll be redirected to the app
- Everything is working!

**❌ If login fails:**

**Error: "Invalid credentials"**
- Make sure you're using the exact email/password you registered with
- Try registering a new account
- Check browser console (F12) for detailed errors

**Error: "User profile not found"**
- This happens if registration didn't create a Firestore user document
- Try registering again
- Check backend terminal for errors

**Error: "Firebase not initialized"**
- Check `src/config/firebase.js` is correct
- Make sure you saved the file
- Restart frontend server (`Ctrl+C` then `npm run dev` again)

**Error: Connection refused / Network error**
- Backend is not running - go to Step 14
- Check both servers are running:
  - Backend: `http://127.0.0.1:8000`
  - Frontend: `http://localhost:5173`

---

## 🐛 Common Problems & Solutions

### Problem 1: "ModuleNotFoundError: No module named 'django'"

**Solution:**
```bash
cd backend
source venv/bin/activate  # MUST activate venv first!
pip install -r requirements.txt
```

**Verify venv is active:**
- You should see `(venv)` in your terminal prompt
- Run `which python` - should point to `backend/venv/bin/python`

### Problem 2: "Port 8000 already in use"

**Solution:**
```bash
# Find and kill the process using port 8000
pkill -f "python manage.py runserver"

# OR find the process ID and kill it
lsof -ti:8000 | xargs kill -9
```

Then start the server again.

### Problem 3: "Port 5173 already in use"

**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Problem 4: "Firebase credentials not found"

**Solution:**
1. Check `.env` file exists in `backend/` directory
2. Check `FIREBASE_CREDENTIALS_PATH` in `.env` matches your JSON filename exactly
3. Verify the JSON file exists in `backend/` directory
4. Check file permissions: `ls -la backend/firebase-credentials.json`

### Problem 5: "Node.js version error"

**Solution:**
```bash
# Install correct Node version using nvm
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
node --version  # Verify it shows v20.x.x or v22.x.x
```

### Problem 6: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem 7: Login works but pages show errors

**Solution:**
1. Check browser console (F12 → Console tab) for errors
2. Check backend terminal for error messages
3. Make sure both servers are running
4. Clear browser cache: `Ctrl+Shift+Delete` → Clear cache

### Problem 8: "CORS error" in browser console

**Solution:**
1. Make sure `backend/config/settings.py` has:
   ```python
   CORS_ALLOWED_ORIGINS = [
       'http://localhost:5173',
   ]
   ```
2. Restart backend server
3. Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

---

## 📝 Quick Reference: Starting the App

**Every time you want to run the app:**

**Terminal 1 (Backend):**
```bash
cd Full-Stack-Project/backend
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd Full-Stack-Project/frontend/fitness-app
npm run dev
```

Then open: `http://localhost:5173`

---

## ✅ Success Checklist

Before asking for help, verify:

- [ ] Python 3.9+ installed (`python3 --version`)
- [ ] Node.js 20.19+ or 22.12+ installed (`node --version`)
- [ ] Backend virtual environment created and activated
- [ ] All Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Firebase project created
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Service account JSON file downloaded
- [ ] `.env` file created in `backend/` with correct `FIREBASE_CREDENTIALS_PATH`
- [ ] Firestore security rules set
- [ ] Django migrations run (`python manage.py migrate`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Firebase config updated in `frontend/fitness-app/src/config/firebase.js`
- [ ] Backend server running on `http://127.0.0.1:8000`
- [ ] Frontend server running on `http://localhost:5173`
- [ ] Can access `http://localhost:5173` in browser
- [ ] Can register a new account
- [ ] Can login with registered account

---

## 🆘 Still Having Issues?

1. **Check both terminals** for error messages (backend AND frontend)
2. **Check browser console** (F12 → Console tab) for JavaScript errors
3. **Verify all steps** in the checklist above
4. **Check file paths** - make sure you're in the right directories
5. **Restart both servers** - sometimes a fresh start helps
6. **Check Firebase Console** - make sure services are enabled

**Common mistakes:**
- ❌ Forgetting to activate virtual environment
- ❌ Wrong Firebase project ID in frontend config
- ❌ Wrong path to credentials file in `.env`
- ❌ Not running both servers at the same time
- ❌ Using wrong Node.js version

---

## 🎉 You're All Set!

Once everything is working:
- Register a new account
- Explore the Communities page
- Try creating posts and replies
- Check out the Progress tracking features
- Explore the Clusters feature

**Happy coding! 🚀**


