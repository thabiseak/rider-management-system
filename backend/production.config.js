// Production Configuration for Backend
module.exports = {
  NODE_ENV: 'production',
  PORT: process.env.PORT || 5001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://your-frontend-url.vercel.app'
};
