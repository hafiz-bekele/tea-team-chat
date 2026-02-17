# 🚀 Tea Team Chat - Deployment Guide

Complete guide to deploy your Tea Team Chat application to production.

---

## 📋 Table of Contents

1. [Backend Deployment Preparation](#backend-deployment-preparation)
2. [Frontend Deployment Preparation](#frontend-deployment-preparation)
3. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
4. [Deploy Backend (Railway/Render)](#deploy-backend)
5. [Deploy Frontend (Vercel/Netlify)](#deploy-frontend)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Testing & Verification](#testing--verification)

---

## 🔧 Backend Deployment Preparation

### Step 1: Environment Variables

Your backend needs these environment variables in production:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Session
SESSION_SECRET=your_super_secret_session_key_min_32_characters

# Client URL (Frontend)
CLIENT_URL=https://your-frontend-domain.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Optional - for verification emails)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### Step 2: Update .env.example

Already done! Your `.env.example` file is ready.

### Step 3: Create .gitignore

Create/update `.gitignore` in the server folder:

```gitignore
# Dependencies
node_modules/

# Environment variables
.env

# Uploads (use cloud storage in production)
uploads/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

### Step 4: Backend Checklist

- ✅ `server.js` configured with production settings
- ✅ Environment variables ready
- ✅ Error handling implemented
- ✅ CORS configured for production
- ✅ Helmet security headers enabled
- ✅ Health check endpoint (`/api/health`)
- ✅ Start script in package.json
- ✅ MongoDB connection with error handling

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (Free tier M0)

### Step 2: Configure Database

1. **Create Database User**:
   - Go to Database Access
   - Add New Database User
   - Username: `teateam`
   - Password: Generate strong password
   - Role: Read and write to any database

2. **Whitelist IP Addresses**:
   - Go to Network Access
   - Add IP Address
   - Allow access from anywhere: `0.0.0.0/0`
   - (For production, restrict to your server IPs)

3. **Get Connection String**:
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://teateam:<password>@cluster0.xxxxx.mongodb.net/tea-team-chat?retryWrites=true&w=majority`

### Step 3: Test Connection Locally

Update your `.env`:
```env
MONGODB_URI=mongodb+srv://teateam:yourpassword@cluster0.xxxxx.mongodb.net/tea-team-chat?retryWrites=true&w=majority
```

Test:
```bash
cd server
npm run dev
```

You should see: `✅ MongoDB connected successfully`

---

## 🚂 Deploy Backend (Railway)

### Option A: Railway (Recommended)

#### Step 1: Prepare for Railway

1. Create `Procfile` in server folder:
```
web: node server.js
```

2. Ensure `package.json` has start script:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

#### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repository
6. Choose the `server` folder as root directory

#### Step 3: Configure Environment Variables

In Railway dashboard:
1. Go to Variables tab
2. Add all environment variables from your `.env`
3. Important variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   CLIENT_URL=https://your-frontend.vercel.app
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

#### Step 4: Deploy

1. Railway will automatically deploy
2. Wait for deployment to complete
3. Get your backend URL: `https://your-app.railway.app`
4. Test: `https://your-app.railway.app/api/health`

### Option B: Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. New → Web Service
4. Connect your repository
5. Configure:
   - Name: `tea-team-chat-backend`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables
7. Create Web Service

---

## ⚛️ Frontend Deployment Preparation

### Step 1: Update API URLs

Update all API calls to use environment variable:

Create `.env` in client folder:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

Create `.env.production` in client folder:
```env
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_SOCKET_URL=https://your-backend.railway.app
```

### Step 2: Update axios baseURL

Create `client/src/config/api.js`:
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 3: Update Socket.io Connection

Update `client/src/context/SocketContext.js`:
```javascript
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
});
```

### Step 4: Build Test

Test production build locally:
```bash
cd client
npm run build
```

Should create `build` folder without errors.

---

## 🌐 Deploy Frontend (Vercel)

### Option A: Vercel (Recommended)

#### Step 1: Prepare for Vercel

1. Ensure `build` folder is in `.gitignore`
2. Commit all changes to GitHub

#### Step 2: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Configure:
   - Framework Preset: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`

#### Step 3: Environment Variables

Add in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_SOCKET_URL=https://your-backend.railway.app
```

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment
3. Get your URL: `https://your-app.vercel.app`

### Option B: Netlify

1. Go to [Netlify.com](https://netlify.com)
2. New site from Git
3. Connect repository
4. Configure:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/build`
5. Add environment variables
6. Deploy

---

## 🔐 Post-Deployment Configuration

### Step 1: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. APIs & Services → Credentials
4. Edit OAuth 2.0 Client
5. Add Authorized redirect URIs:
   ```
   https://your-backend.railway.app/api/auth/google/callback
   ```
6. Add Authorized JavaScript origins:
   ```
   https://your-frontend.vercel.app
   ```

### Step 2: Update Backend CORS

Your backend is already configured to use `CLIENT_URL` environment variable.

Verify in Railway:
```
CLIENT_URL=https://your-frontend.vercel.app
```

### Step 3: Update Frontend URLs

In Vercel environment variables:
```
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_SOCKET_URL=https://your-backend.railway.app
```

Redeploy frontend after updating.

### Step 4: Test All Features

1. ✅ User registration
2. ✅ User login
3. ✅ Google OAuth login
4. ✅ Send messages
5. ✅ Real-time updates
6. ✅ File upload
7. ✅ Voice messages
8. ✅ Profile picture upload
9. ✅ Video calls

---

## 🧪 Testing & Verification

### Backend Health Check

```bash
curl https://your-backend.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Tea Team Chat API is running",
  "environment": "production",
  "timestamp": "2026-02-17T..."
}
```

### Frontend Test

1. Open `https://your-frontend.vercel.app`
2. Register new account
3. Login
4. Send test message
5. Check real-time updates

### Socket.io Test

Open browser console on frontend:
```javascript
// Should see Socket.io connection logs
```

---

## 📊 Monitoring & Maintenance

### Railway Monitoring

1. View logs in Railway dashboard
2. Monitor CPU and memory usage
3. Set up alerts for downtime

### MongoDB Atlas Monitoring

1. View database metrics
2. Monitor connection count
3. Set up alerts for high usage

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

---

## 🔒 Security Checklist

- ✅ Environment variables secured
- ✅ JWT secrets are strong (32+ characters)
- ✅ CORS configured for production domain only
- ✅ Helmet security headers enabled
- ✅ MongoDB Atlas IP whitelist configured
- ✅ HTTPS enabled (automatic on Vercel/Railway)
- ✅ Session cookies secure in production
- ✅ File upload size limits enforced
- ✅ Input validation on all routes

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Solution**: Update `CLIENT_URL` in backend environment variables to match your frontend domain exactly.

### Issue: Socket.io Not Connecting

**Solution**: 
1. Check `REACT_APP_SOCKET_URL` in frontend
2. Verify WebSocket is enabled on hosting platform
3. Check browser console for errors

### Issue: MongoDB Connection Failed

**Solution**:
1. Verify connection string is correct
2. Check MongoDB Atlas IP whitelist
3. Ensure database user has correct permissions

### Issue: File Upload Fails

**Solution**:
1. Check file size limits
2. Verify `uploads` folder exists
3. Consider using cloud storage (Cloudinary) for production

### Issue: Google OAuth Not Working

**Solution**:
1. Verify redirect URIs in Google Console
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Ensure callback URL matches exactly

---

## 📈 Performance Optimization

### Backend

1. **Enable Compression**:
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add Rate Limiting**:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Frontend

1. **Code Splitting**: Already done with React lazy loading
2. **Image Optimization**: Use WebP format
3. **Caching**: Configure service worker

---

## 🎉 Deployment Complete!

Your Tea Team Chat application is now live!

**Backend**: `https://your-backend.railway.app`
**Frontend**: `https://your-frontend.vercel.app`

### Next Steps:

1. Share the link with your team
2. Monitor for errors
3. Gather user feedback
4. Plan future features

---

## 📞 Support

If you encounter issues:
1. Check logs in Railway/Vercel dashboard
2. Review this guide
3. Check MongoDB Atlas metrics
4. Test locally first

---

**Deployed by**: Tea Team
**Date**: February 17, 2026
**Version**: 1.0.0

☕ Happy Chatting!
