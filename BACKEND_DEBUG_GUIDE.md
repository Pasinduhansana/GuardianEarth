# Backend Connection Debugging Guide

## ✅ Issues Fixed

### 1. Missing HTTPS Protocol in Client .env

**Problem**: `VITE_API_URL=guardianearth-production.up.railway.app`
**Fixed**: `VITE_API_URL=https://guardianearth-production.up.railway.app`

### 2. CORS Configuration

**Problem**: Basic CORS setup without proper origin handling
**Fixed**: Added comprehensive CORS configuration with support for multiple origins

## 🔧 Required Setup Steps

### Step 1: Backend Environment Variables (Railway)

Your backend needs these environment variables set in Railway dashboard:

```env
# Required
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret

# Frontend URLs (for CORS)
FRONTEND_URL=https://your-frontend-url.netlify.app
CLIENT_URL=https://your-frontend-url.vercel.app

# Services
CLOUDINARY_API_KEY=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Optional
PORT=5000
NODE_ENV=production
```

### Step 2: Client Environment Variables

Your `.env` file in client folder should have:

```env
VITE_API_URL=https://guardianearth-production.up.railway.app
VITE_FLOOD_API_URL=http://localhost:5001
```

### Step 3: Rebuild Frontend

After changing .env, you must rebuild:

```bash
cd client
npm run build
```

Then redeploy to Netlify/Vercel.

## 🔍 How to Debug

### Test 1: Check if Backend is Running

Open browser and visit:

```
https://guardianearth-production.up.railway.app/api/disaster
```

**Expected**: JSON response with disasters data
**If fails**: Backend is not running or not deployed properly

### Test 2: Check CORS

Open browser console on your frontend and check for errors like:

```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**If you see this**: Add your frontend URL to Railway environment variables:

- `FRONTEND_URL=https://your-site.netlify.app`

### Test 3: Check Environment Variables

In Railway dashboard:

1. Go to your project
2. Click on "Variables" tab
3. Verify all required variables are set

### Test 4: Check Logs

In Railway dashboard:

1. Click on "Deployments" tab
2. Click on the latest deployment
3. Check logs for errors

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to fetch" Error

**Cause**: Missing https:// in VITE_API_URL
**Solution**: ✅ Already fixed - Added https:// prefix

### Issue 2: CORS Error

**Cause**: Backend doesn't recognize frontend origin
**Solution**: Add `FRONTEND_URL` and `CLIENT_URL` to Railway environment variables

### Issue 3: 500 Server Error

**Cause**: Missing environment variables on backend
**Solution**: Set all required variables in Railway dashboard

### Issue 4: MongoDB Connection Failed

**Cause**: Wrong `MONGO_URI` or MongoDB not accessible
**Solution**: Verify your MongoDB connection string in Railway variables

### Issue 5: JWT/Auth Errors

**Cause**: Missing `JWT_SECRET` or `REFRESH_SECRET`
**Solution**: Set these in Railway environment variables

## 📋 Verification Checklist

- [ ] Backend deployed to Railway
- [ ] All environment variables set in Railway dashboard
- [ ] Frontend .env has correct HTTPS URL
- [ ] Frontend rebuilt after .env change
- [ ] Frontend redeployed to Netlify/Vercel
- [ ] Test API endpoint in browser works
- [ ] CORS allows your frontend domain
- [ ] MongoDB connection working
- [ ] Cloudinary credentials valid
- [ ] Stripe key configured (if using payments)

## 🚀 Quick Test Commands

### Test Backend Health

```bash
curl https://guardianearth-production.up.railway.app/api/disaster
```

### Test from Frontend (Browser Console)

```javascript
fetch("https://guardianearth-production.up.railway.app/api/disaster")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

### Check Environment Variables (Local Backend)

```bash
cd backend
node -e "require('dotenv').config(); console.log(process.env)"
```

## 📞 Next Steps

1. **Set Railway Environment Variables**
   - Go to Railway dashboard
   - Navigate to your project
   - Click "Variables" tab
   - Add all required variables from the list above

2. **Rebuild & Redeploy Frontend**

   ```bash
   cd client
   npm run build
   # Then redeploy to your hosting platform
   ```

3. **Test the Connection**
   - Open your deployed frontend
   - Open browser console (F12)
   - Try to login or fetch data
   - Check for any error messages

4. **Check Railway Logs**
   - If still not working, check Railway deployment logs
   - Look for startup errors or missing variables

## 🔗 Important Links

- Railway Dashboard: https://railway.app/dashboard
- Backend URL: https://guardianearth-production.up.railway.app
- Set Frontend URL in Railway as: `FRONTEND_URL` and `CLIENT_URL`

## ⚠️ Security Notes

1. Never commit `.env` files to Git
2. Use strong random strings for JWT secrets
3. Use app-specific passwords for Gmail (not your account password)
4. Keep Stripe keys secure
5. Restrict CORS origins in production (currently allowing all for debugging)
