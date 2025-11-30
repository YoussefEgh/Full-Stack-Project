# ⚡ Quick Start Guide

**For when you just need to remember the commands!**

## 🔧 Initial Setup (One-Time Only)

See [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) for detailed instructions.

## 🚀 Starting the Application

### Terminal 1: Backend (Django)
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

**Should see:** `Starting development server at http://127.0.0.1:8000/`

### Terminal 2: Frontend (React)
```bash
cd frontend/fitness-app
npm run dev
```

**Should see:** `Local: http://localhost:5173/`

### Open Browser
```
http://localhost:5173
```

---

## ✅ Pre-Run Checklist

Before starting, make sure:
- [ ] Virtual environment activated (see `(venv)` in terminal)
- [ ] `.env` file exists in `backend/` directory
- [ ] Firebase credentials JSON file exists in `backend/`
- [ ] `src/config/firebase.js` has correct Firebase config

---

## 🐛 Common Issues

### "Module not found" error
→ Activate virtual environment: `source venv/bin/activate`

### "Port already in use"
→ Kill process: `pkill -f "python manage.py runserver"`

### "Firebase not initialized"
→ Check `src/config/firebase.js` has correct config

### Login errors
→ Make sure **BOTH** servers are running!

---

## 📝 Important Files

- **Backend config:** `backend/.env`
- **Frontend Firebase config:** `frontend/fitness-app/src/config/firebase.js`
- **Firebase credentials:** `backend/firebase-credentials.json` (or your custom name)

---

## 🔗 Full Documentation

For detailed setup, troubleshooting, and explanations:
👉 [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)


