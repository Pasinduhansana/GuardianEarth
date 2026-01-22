// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const FLOOD_API_URL = import.meta.env.VITE_FLOOD_API_URL || "http://localhost:5001";

// Helper function to build API URLs
const buildUrl = (path) => `${API_BASE_URL}${path}`;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  register: buildUrl("/api/auth/register"),
  login: buildUrl("/api/auth/login"),
  forgotPassword: buildUrl("/api/auth/forgot-password"),
  resetPassword: buildUrl("/api/auth/reset-password"),
  changePassword: buildUrl("/api/auth/change-password"),
  users: buildUrl("/api/auth/users"),

  // Disaster
  disaster: buildUrl("/api/disaster"),

  // Posts
  posts: buildUrl("/api/posts"),

  // User
  userProfile: buildUrl("/api/user/profile"),
  upload: buildUrl("/api/upload"),
  uploadFile: buildUrl("/api/uploadfile"),

  // Payment
  payment: buildUrl("/api/payment"),
  stripePayment: buildUrl("/api/payment/stripe-payment"),
  verifyBankPayment: buildUrl("/api/payment/verify-bank-payment"),

  // Email
  email: buildUrl("/api/email"),

  // Dashboard
  dashboard: buildUrl("/api/dashboard"),

  // Flood Prediction
  floodPredict: `${FLOOD_API_URL}/predict`,
};

export default API_BASE_URL;
