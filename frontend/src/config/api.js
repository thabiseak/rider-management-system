// API Configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://rider-backend-wt3c.onrender.com' 
  : 'http://192.168.1.71:5001';

// For local development, use network IP for cross-device access
const LOCAL_API_URL = 'http://192.168.1.71:5001';

// Default to local network IP if NODE_ENV is not set
export default process.env.NODE_ENV === 'production' ? API_BASE_URL : LOCAL_API_URL;
