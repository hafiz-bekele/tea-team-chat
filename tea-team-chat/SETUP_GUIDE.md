# 🚀 Tea Team Chat - Complete Setup Guide

This guide will walk you through setting up the Tea Team Chat application from scratch.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js (v14 or higher) installed
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] Gmail account (for email verification)
- [ ] Google Cloud Console account (for OAuth)

## 🔧 Step-by-Step Setup

### Step 1: Install Node.js

1. Download from [nodejs.org](https://nodejs.org/)
2. Install the LTS version
3. Verify installation:
```bash
node --version
npm --version
```

### Step 2: Install MongoDB

**Option A: Local Installation**
1. Download from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Whitelist your IP address

### Step 3: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd tea-team-chat

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 4: Configure Google OAuth

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Name: "Tea Team Chat"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External"
   - Fill in:
     - App name: Tea Team Chat
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"

5. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Tea Team Chat Web"
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
     - `http://localhost:3000/auth/success`
   - Click "Create"
   - **Copy Client ID and Client Secret**

### Step 5: Configure Gmail for Email Verification

1. **Enable 2-Factor Authentication**
   - Go to Google Account Settings
   - Security → 2-Step Verification
   - Follow setup instructions

2. **Generate App Password**
   - In Security settings
   - 2-Step Verification → App passwords
   - Select app: "Mail"
   - Select device: "Other" (Custom name)
   - Name it: "Tea Team Chat"
   - Click "Generate"
   - **Copy the 16-character password**

### Step 6: Create Environment File

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/tea-team-chat

# JWT Secrets (Generate random strings)
JWT_SECRET=tea_team_super_secret_key_2024_change_this
JWT_REFRESH_SECRET=tea_team_refresh_secret_key_2024_change_this
SESSION_SECRET=tea_team_session_secret_2024_change_this

# Google OAuth (From Step 4)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Email Configuration (From Step 5)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password

# Client URL
CLIENT_URL=http://localhost:3000
```

**Important:** Replace all placeholder values with your actual credentials!

### Step 7: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
🌐 Client URL: http://localhost:3000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```

Browser should automatically open to `http://localhost:3000`

## ✅ Verify Installation

### Test Backend
1. Open browser to: `http://localhost:5000/api/health`
2. Should see: `{"status":"ok","message":"Tea Team Chat API is running"}`

### Test Frontend
1. Open browser to: `http://localhost:3000`
2. Should see the Tea Team Chat landing page

### Test Registration
1. Click "Sign Up"
2. Fill in the form
3. Submit
4. Check your email for verification link

### Test Google OAuth
1. Click "Continue with Google"
2. Select your Google account
3. Should redirect back to the app

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using the port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Google OAuth Error
```
Error: redirect_uri_mismatch
```
**Solution:** 
1. Check redirect URI in Google Console matches exactly
2. Make sure it's `http://localhost:5000/api/auth/google/callback`

### Email Not Sending
```
Error: Invalid login
```
**Solution:**
1. Verify 2FA is enabled on Gmail
2. Use App Password, not regular password
3. Check EMAIL_USER and EMAIL_PASS in .env

### React Build Errors
```
Module not found
```
**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change all default secrets in .env
- [ ] Use strong, random JWT secrets
- [ ] Enable HTTPS
- [ ] Set secure cookie options
- [ ] Add rate limiting
- [ ] Validate all user inputs
- [ ] Set up CORS properly
- [ ] Use environment-specific configs
- [ ] Never commit .env files
- [ ] Use MongoDB Atlas with authentication

## 📱 Testing the Application

### Create Test Users
1. Register 2-3 test accounts
2. Verify emails
3. Login with each account

### Test Chat Features
1. Select a user from the sidebar
2. Send messages
3. Check real-time delivery
4. Test online/offline status

### Test Profile
1. Click Settings icon
2. Update username
3. Add profile picture URL
4. Save changes

## 🚀 Next Steps

1. **Customize the app:**
   - Change colors in theme
   - Add your university logo
   - Modify landing page content

2. **Add features:**
   - File upload
   - Voice messages
   - Video calls
   - Message reactions

3. **Deploy to production:**
   - See DEPLOYMENT.md for instructions

## 📞 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages carefully
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify all environment variables are set correctly

## 🎉 Success!

If everything is working:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB connected
- ✅ Can register and login
- ✅ Can send messages in real-time
- ✅ Google OAuth working

Congratulations! Your Tea Team Chat is ready to use! ☕

---

Made with ☕ by the Tea Team
