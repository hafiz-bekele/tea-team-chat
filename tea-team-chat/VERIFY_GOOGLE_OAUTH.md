# ✅ Verify Your Google OAuth Setup

Your Client ID: `972890228495-sem3hg6u2pkou56emuiknra13f8tav6f.apps.googleusercontent.com`

## Quick Verification Steps:

### 1. Check if Client ID Exists in Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Look for your Client ID in the list
3. You should see: `972890228495-sem3hg6u2pkou56emuiknra13f8tav6f`

### 2. Verify Redirect URIs

Click on your OAuth client and check these settings:

**Authorized redirect URIs MUST include:**
```
http://localhost:5000/api/auth/google/callback
```

**Important:** 
- No trailing slash (/)
- Must be exactly `http://localhost:5000/api/auth/google/callback`
- Case sensitive

### 3. Check OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Make sure:
   - Publishing status: "Testing" (for development)
   - Test users: Add `hafizbekele434@gmail.com`

### 4. Enable Required APIs

1. Go to: https://console.cloud.google.com/apis/library
2. Search and enable:
   - **Google+ API** (REQUIRED!)
   - **Google People API** (Recommended)

---

## If Client ID Doesn't Exist - Create New One

If you can't find the client ID in Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth client ID"**
4. Application type: **Web application**
5. Name: **Tea Team Chat**

**Authorized JavaScript origins:**
```
http://localhost:3000
http://localhost:5000
```

**Authorized redirect URIs:**
```
http://localhost:5000/api/auth/google/callback
```

6. Click **CREATE**
7. Copy the new Client ID and Client Secret
8. Update your `.env` file

---

## Quick Test

After verifying/fixing the setup:

1. **Restart your server:**
```bash
# In server terminal, press Ctrl+C
# Then run:
npm run dev
```

2. **Test the OAuth flow:**
- Go to: http://localhost:3000/login
- Click "Continue with Google"
- You should see Google's login screen (not an error)

---

## Common Error Messages & Fixes

### "Error 401: invalid_client"
**Cause:** Client ID doesn't exist or is incorrect
**Fix:** Verify Client ID in Google Cloud Console matches .env

### "Error 400: redirect_uri_mismatch"
**Cause:** Redirect URI not configured correctly
**Fix:** Add `http://localhost:5000/api/auth/google/callback` to authorized redirect URIs

### "Access blocked: This app's request is invalid"
**Cause:** OAuth consent screen not configured
**Fix:** Complete OAuth consent screen setup and add test users

### "This app isn't verified"
**Cause:** App is in testing mode (normal for development)
**Fix:** Click "Advanced" → "Go to Tea Team Chat (unsafe)"

---

## Alternative: Use Email/Password Instead

If Google OAuth is too complicated right now, you can:

1. Click **"Sign Up"** (not "Continue with Google")
2. Create account with:
   - Username
   - Email
   - Password
3. Login normally

You can add Google OAuth later when you're ready!

---

## Need to Start Fresh?

If nothing works, create a completely new OAuth client:

1. Delete the old one in Google Cloud Console
2. Create a new OAuth client ID
3. Copy the NEW credentials
4. Update .env with NEW credentials
5. Restart server

---

Your current .env settings:
```
GOOGLE_CLIENT_ID=972890228495-sem3hg6u2pkou56emuiknra13f8tav6f.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

Make sure these match exactly what's in Google Cloud Console!
