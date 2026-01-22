# 🚀 Quick Deployment Guide

## 📦 Environment Variables Setup

### Local Development (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_FLOOD_API_URL=http://localhost:5001
```

### Production (.env.production or Platform)

```env
VITE_API_URL=https://your-backend-domain.com
VITE_FLOOD_API_URL=https://your-flood-api-domain.com
```

---

## 🔧 Platform-Specific Setup

### Netlify

1. Go to **Site settings → Environment variables**
2. Add:
   - `VITE_API_URL` = `https://your-backend-domain.com`
   - `VITE_FLOOD_API_URL` = `https://your-flood-api-domain.com`
3. Deploy: `npm run build`

### Vercel

1. Go to **Project Settings → Environment Variables**
2. Add:
   - `VITE_API_URL` = `https://your-backend-domain.com`
   - `VITE_FLOOD_API_URL` = `https://your-flood-api-domain.com`
3. Deploy: `vercel --prod`

### Manual Deployment

1. Update `.env.production` with your URLs
2. Build: `npm run build`
3. Upload `dist/` folder to your hosting

---

## ✅ Pre-Deployment Checklist

- [ ] Backend API is accessible from the internet
- [ ] CORS is configured on backend to allow your frontend domain
- [ ] Environment variables are set on hosting platform
- [ ] `.env` files are not committed to git
- [ ] All API endpoints return proper responses
- [ ] SSL certificates are configured (HTTPS)

---

## 🧪 Testing

### Test Environment Variables

```bash
# Development
npm run dev
# Check console: import.meta.env.VITE_API_URL

# Production build
npm run build
npm run preview
```

### Test API Connectivity

```bash
# Test if backend is accessible
curl https://your-backend-domain.com/api/disaster

# Expected: JSON response with disasters data
```

---

## 🐛 Troubleshooting

### API calls failing?

✅ Check CORS settings on backend
✅ Verify environment variables are set correctly
✅ Check browser console for errors

### Environment variables not updating?

✅ Rebuild: `npm run build`
✅ Clear cache: `rm -rf node_modules/.vite`
✅ Restart dev server

### 404 errors on API calls?

✅ Verify backend URL is correct
✅ Check backend is running and accessible
✅ Test API endpoint directly in browser

---

## 📞 Quick Commands

```bash
# Install dependencies
npm install

# Local development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Clear cache
rm -rf node_modules/.vite
```

---

## 🔗 Important Files

- `.env` - Local development (not in git)
- `.env.example` - Template for developers
- `.env.production` - Production template
- `src/config/api.js` - API configuration
- `Services/ApiEndPoint.js` - Axios configuration

---

## 📚 Full Documentation

For detailed information, see:

- `ENV_SETUP_GUIDE.md` - Complete setup guide
- `ENVIRONMENT_SETUP_SUMMARY.md` - Summary of changes

---

**Note**: Replace `your-backend-domain.com` and `your-flood-api-domain.com` with your actual backend URLs!
