// API Configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://rider-backend-wt3c.onrender.com' 
  : 'http://localhost:5001';

// For local development, always use localhost
const LOCAL_API_URL = 'http://localhost:5001';

export default API_BASE_URL;
