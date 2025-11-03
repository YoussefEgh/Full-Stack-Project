# Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Firebase

1. Download Firebase service account JSON file
2. Save it in the `backend/` directory
3. Create `.env` file:
   ```env
   FIREBASE_CREDENTIALS_PATH=your-credentials-file.json
   SECRET_KEY=your-secret-key
   DEBUG=True
   ```

### 3. Enable Firebase Services

- Go to Firebase Console
- Enable Authentication (Email/Password)
- Enable Firestore Database
- Set security rules (see README.md)

### 4. Run Server

```bash
source venv/bin/activate
python manage.py runserver
```

Backend runs on `http://localhost:8000`

## Creating Sample Data

```bash
python create_sample_post.py    # Post with replies
python create_more_samples.py   # Multiple posts
```

## Troubleshooting

**Firebase not initialized:**
- Check `.env` file exists and has correct path
- Verify JSON file is valid

**Port in use:**
```bash
pkill -f "python manage.py runserver"
```

## API Endpoints

- `POST /api/auth/register/` - Register user
- `POST /api/auth/login/` - Login user
- `GET /api/communities/posts/` - Get all posts
- `POST /api/communities/posts/` - Create post
- `POST /api/communities/posts/{id}/like/` - Like post
- `POST /api/communities/posts/{id}/replies/` - Create reply

