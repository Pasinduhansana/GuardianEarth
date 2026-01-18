// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
  changePassword: `${API_BASE_URL}/api/auth/change-password`,
  users: `${API_BASE_URL}/api/auth/users`,
  
  // Disaster
  disaster: `${API_BASE_URL}/api/disaster`,
  
  // Posts
  posts: `${API_BASE_URL}/api/posts`,
  
  // User
  userProfile: `${API_BASE_URL}/api/user/profile`,
  upload: `${API_BASE_URL}/api/upload`,
  
  // Payment
  payment: `${API_BASE_URL}/api/payment`,
};

export default API_BASE_URL;
