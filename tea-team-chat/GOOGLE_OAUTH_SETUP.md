# 🔧 Google OAuth Setup - Step by Step

## Error: "The OAuth client was not found" - How to Fix

This error means your Google Cloud Console is not properly configured. Follow these steps:

---

## Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account (hafizbekele434@gmail.com)

---

## Step 2: Select or Create Project

1. Click on the project dropdown at the top
2. If you have a project, select it
3. If not, click "NEW PROJECT"
   - Name: "Tea Team Chat"
   - Click "CREATE"

---

## Step 3: Enable Google+ API (IMPORTANT!)

1. In the left menu, go to: **APIs & Services** → **Library**
2. Search for: "Google+ API"
3. Click on it
4. Click **"ENABLE"** button
5. Wait for it to enable (this is crucial!)

---

## Step 4: Configure OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen**
2. Select **"External"** (for testing)
3. Click **"CREATE"**

### Fill in the form:

**App Information:**
- App name: `Tea Team Chat`
- User support email: `hafizbekele434@gmail.com`
- App logo: (optional, skip for now)

**App Domain:**
- Application home page: `http://localhost:3000`
- Application privacy policy link: `http://localhost:3000` (for testing)
- Application terms of service link: `http://localhost:3000` (for testing)

**Developer contact information:**
- Email addresses: `hafizbekele434@gmail.com`

4. Click **"SAVE AND CONTINUE"**

### Scopes (Step 2):
1. Click **"ADD OR REMOVE SCOPES"**
2. Select these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
3. Click **"UPDATE"**
4. Click **"SAVE AND CONTINUE"**

### Test users (Step 3):
1. Click **"ADD USERS"**
2. Add your email: `hafizbekele434@gmail.com`
3. Add any other test emails you want
4. Click **"ADD"**
5. Click **"SAVE AND CONTINUE"**

### Summary (Step 4):
1. Review everything
2. Click **"BACK TO DASHBOARD"**

---

## Step 5: Create OAuth 2.0 Credentials

1. Go to: **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

### Configure OAuth Client:

**Application type:** Web application

**Name:** Tea Team Chat Web Client

**Authorized JavaScript origins:**
- Click **"+ ADD URI"**
- Add: `http://localhost:3000`
- Click **"+ ADD URI"** again
- Add: `http://localhost:5000`

**Authorized redirect URIs:**
- Click **"+ ADD URI"**
- Add: `http://localhost:5000/api/auth/google/callback`
- Click **"+ ADD URI"** again  
- Add: `http://localhost:3000/auth/success`

4. Click **"CREATE"**

---

## Step 6: Copy Your Credentials

After creating, you'll see a popup with:
- **Client ID** (looks like: xxxxx-xxxxx.apps.googleusercontent.com)
- **Client Secret** (looks like: GOCSPX-xxxxx)

### Update your .env file:

```env
GOOGLE_CLIENT_ID=your_new_client_id_here
GOOGLE_CLIENT_SECRET=your_new_client_secret_here
```

---

## Step 7: Restart Your Server

After updating .env:

```bash
# Stop the server (Ctrl+C in the terminal)
# Then restart:
cd server
npm run dev
```

---

## Step 8: Test Google Login

1. Go to: http://localhost:3000
2. Click "Sign Up" or "Log In"
3. Click "Continue with Google"
4. You should see Google's login screen
5. Select your account
6. Grant permissions
7. You should be redirected back to the app

---

## Common Issues & Solutions

### Issue 1: "Access blocked: This app's request is invalid"
**Solution:** Make sure you added the correct redirect URI:
- `http://localhost:5000/api/auth/google/callback`

### Issue 2: "Error 401: invalid_client"
**Solution:** 
- Double-check your Client ID and Client Secret in .env
- Make sure there are no extra spaces
- Restart the server after changing .env

### Issue 3: "This app isn't verified"
**Solution:** 
- This is normal for development
- Click "Advanced" → "Go to Tea Team Chat (unsafe)"
- This only appears during testing

### Issue 4: "redirect_uri_mismatch"
**Solution:**
- Go back to Google Cloud Console
- Check Authorized redirect URIs
- Make sure it's exactly: `http://localhost:5000/api/auth/google/callback`
- No trailing slash!

---

## Verification Checklist

Before testing, verify:

- [ ] Google+ API is enabled
- [ ] OAuth consent screen is configured
- [ ] Test users are added (your email)
- [ ] OAuth client is created
- [ ] Authorized redirect URI is: `http://localhost:5000/api/auth/google/callback`
- [ ] Client ID and Secret are in .env file
- [ ] No extra spaces in .env values
- [ ] Server is restarted after .env changes

---

## Alternative: Skip Google OAuth (For Testing)

If you want to test the app without Google OAuth:

1. Just use regular email/password registration
2. Click "Sign Up" instead of "Continue with Google"
3. Fill in username, email, password
4. You can add Google OAuth later

---

## Need Help?

If you're still having issues:

1. Check the server terminal for error messages
2. Check the browser console (F12) for errors
3. Make sure MongoDB is running
4. Verify all .env variables are set correctly

---

## Your Current Configuration

Based on your .env file:

```
GOOGLE_CLIENT_ID=972890228495-sem3hg6u2pkou56emuiknra13f8tav6f.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

**Action Required:**
1. Go to Google Cloud Console
2. Verify this Client ID exists in your project
3. If not, create a new one following Step 5 above
4. Update .env with the new credentials

---

Made with ☕ by Tea Team
