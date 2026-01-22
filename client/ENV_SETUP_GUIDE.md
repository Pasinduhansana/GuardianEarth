# Environment Configuration Setup

This document explains how the environment variables are configured for the GuardianEarth client application.

## Overview

The client application uses environment variables to manage API endpoints for different environments (local development vs production).

## Environment Variables

### Available Variables

- **VITE_API_URL**: The base URL for the main backend API
  - Local: `http://localhost:5000`
  - Production: Your hosted backend URL (e.g., `https://api.yoursite.com`)

- **VITE_FLOOD_API_URL**: The base URL for the flood prediction API service
  - Local: `http://localhost:5001`
  - Production: Your hosted flood API URL

## Setup Instructions

### For Local Development

1. The `.env` file is already configured with local URLs:

   ```env
   VITE_API_URL=http://localhost:5000
   VITE_FLOOD_API_URL=http://localhost:5001
   ```

2. Start your backend server on port 5000
3. Start your flood prediction API on port 5001 (if using)
4. Run the client: `npm run dev`

### For Production Deployment

1. Update `.env.production` with your hosted backend URLs:

   ```env
   VITE_API_URL=https://your-backend-domain.com
   VITE_FLOOD_API_URL=https://your-flood-api-domain.com
   ```

2. Build the application:

   ```bash
   npm run build
   ```

3. The build process will automatically use `.env.production` values

### For Platform-Specific Deployment

#### Netlify

Add environment variables in: **Site settings > Environment variables**

#### Vercel

Add environment variables in: **Project Settings > Environment Variables**

#### Other Hosting Platforms

Consult your hosting platform's documentation for setting environment variables.

## File Structure

```
client/
├── .env                    # Local development (not committed to git)
├── .env.example            # Template file (committed to git)
├── .env.production         # Production values template (committed to git)
├── src/
│   └── config/
│       └── api.js          # Central API configuration
└── Services/
    └── ApiEndPoint.js      # Axios instance configuration
```

## How It Works

### 1. API Configuration (src/config/api.js)

The `api.js` file exports the base URLs and pre-configured API endpoints:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const FLOOD_API_URL = import.meta.env.VITE_FLOOD_API_URL || "http://localhost:5001";

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  // ... other endpoints
};
```

### 2. Usage in Components

Import and use the API configuration in your components:

```javascript
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

// Example: Fetch data
const response = await fetch(`${API_BASE_URL}/api/disaster`);

// Or use pre-configured endpoint
const response = await fetch(API_ENDPOINTS.disaster);
```

### 3. Axios Instance (Services/ApiEndPoint.js)

The axios instance automatically uses the environment variable:

```javascript
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
```

## Files Updated

All API calls in the following files have been updated to use environment variables:

### Pages

- UserManagement.jsx
- Register.jsx
- Login.jsx
- ResetPassword.jsx
- ForgotPassword.jsx
- AuthPage.jsx
- Profile.jsx
- Payment.jsx

### Components

- disaster-management/ViewDisaster.jsx
- disaster-management/DisasterForm.jsx
- disaster-management/adminDisasterView.jsx
- community-support/PostForm.jsx
- community-support/PostView.jsx
- community-support/adminPostsView.jsx
- disaster-funding/Payment_Grid.jsx
- disaster-funding/Checkout.jsx
- main-components/homecomp/home.jsx
- main-components/prediction-model/FloodPredictor.jsx

### Admin

- Admin/Dashboard.jsx
- Components/admin-dashboard/Dashboard-Datagrid.jsx

### Services

- Services/ApiEndPoint.js

## Troubleshooting

### Issue: API calls failing in production

**Solution**: Ensure your `.env.production` file has the correct production URLs and rebuild the application.

### Issue: Environment variables not updating

**Solution**:

1. Stop the development server
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart: `npm run dev`

### Issue: CORS errors in production

**Solution**: Ensure your backend allows requests from your frontend domain. Update CORS settings in your backend configuration.

## Security Notes

1. **Never commit `.env` files** with sensitive data to version control
2. The `.gitignore` file is configured to exclude `.env` files
3. `.env.example` and `.env.production` are templates and should not contain actual sensitive values
4. For production, use your hosting platform's environment variable management system

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
