// API Base URL Configuration
// In development, defaults to http://localhost:5000
// In production on Vercel, set VITE_API_URL in Vercel environment variables
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
export default API_BASE_URL;
