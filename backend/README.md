# Rider Management Backend

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

### Server Configuration
- `PORT`: Server port (default: 5001)
- `NODE_ENV`: Environment (development/production)

### Database Configuration
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_URI`: Database connection string

### Security Configuration
- `JWT_SECRET`: Secret key for JWT tokens
- `BCRYPT_ROUNDS`: Number of bcrypt rounds
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window

### CORS Configuration
- `CORS_ORIGIN`: Allowed origin for CORS
- `CORS_CREDENTIALS`: Allow credentials in CORS
