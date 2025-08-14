// Load environment variables first
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: './env.production' });
} else {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const Rider = require('./models/Rider');
const mongoose = require('mongoose'); // Added for health check
const fs = require('fs');
const path = require('path');

const app = express();

// Fallback data source for development
let useLocalData = false;
let localRiders = [];

// Load local data if available
function loadLocalData() {
  try {
    const dataPath = path.join(__dirname, 'riders.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      localRiders = JSON.parse(data);
      console.log(`📁 Loaded ${localRiders.length} riders from local JSON file`);
      return true;
    }
  } catch (error) {
    console.log('📁 No local data file found or error reading it');
  }
  return false;
}

// CORS configuration with better environment handling
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.CORS_ORIGIN === '*' ? '*' : process.env.CORS_ORIGIN?.split(',') || ['*'])
    : (process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://192.168.1.71:3000', 'http://127.0.0.1:3000']),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Add logging middleware based on environment
if (process.env.ENABLE_REQUEST_LOGGING !== 'false') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.path;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    
    console.log(`📝 ${timestamp} - ${method} ${path} - IP: ${ip} - UA: ${userAgent}`);
    next();
  });
}

// Body parsing middleware with configurable limits
const bodyLimit = process.env.REQUEST_BODY_LIMIT || '50mb';
const timeoutMs = parseInt(process.env.REQUEST_TIMEOUT_MS) || 30000;

app.use(express.json({ 
  limit: bodyLimit,
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  limit: bodyLimit, 
  extended: true 
}));

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(timeoutMs, () => {
    res.status(408).json({ error: 'Request timeout' });
  });
  next();
});

// Database connection check middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1 && !useLocalData) {
    return res.status(503).json({ 
      error: 'Database not connected', 
      details: ['Please try again in a moment. The database is still connecting.'] 
    });
  }
  next();
});

// Validation function
function validateRiderFields(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.position || data.position.trim().length < 2) {
    errors.push('Position must be at least 2 characters long');
  }
  
  if (!data.nric || data.nric.trim().length < 5) {
    errors.push('NRIC must be at least 5 characters long');
  }
  
  if (!data.phone || data.phone.trim().length < 8) {
    errors.push('Phone number must be at least 8 characters long');
  }
  
  if (!data.vehicle || !['Motorcycle', 'Bicycle', 'Car'].includes(data.vehicle)) {
    errors.push('Vehicle must be Motorcycle, Bicycle, or Car');
  }
  
  if (!data.license || data.license.trim().length < 3) {
    errors.push('License must be at least 3 characters long');
  }
  
  if (data.rating && (data.rating < 0 || data.rating > 5)) {
    errors.push('Rating must be between 0 and 5');
  }
  
  if (data.ridesCompleted && data.ridesCompleted < 0) {
    errors.push('Rides completed cannot be negative');
  }
  
  return errors;
}

// Seed initial data if database is empty
async function seedInitialData() {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ Database not ready yet, skipping seeding for now');
      return;
    }
    
    const count = await Rider.countDocuments();
    if (count === 0) {
      const initialRiders = [
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Senior Rider',
          nric: 'S1234567A',
          image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
          status: 'active',
          phone: '+1234567890',
          vehicle: 'Motorcycle',
          license: 'MC123456',
          rating: 4.8,
          ridesCompleted: 245
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          position: 'Lead Rider',
          nric: 'S7654321B',
          image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
          status: 'active',
          phone: '+1234567891',
          vehicle: 'Bicycle',
          license: 'BC789012',
          rating: 4.9,
          ridesCompleted: 189
        },
        {
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          position: 'Rider',
          nric: 'S2345678C',
          image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
          status: 'inactive',
          phone: '+1234567892',
          vehicle: 'Car',
          license: 'CR345678',
          rating: 4.5,
          ridesCompleted: 156
        }
      ];
      
      await Rider.insertMany(initialRiders);
      console.log('✅ Initial riders seeded to database');
    } else {
      console.log(`🌱 Database already has ${count} riders, skipping seeding`);
    }
  } catch (error) {
    console.error('❌ Error seeding initial data:', error);
  }
}

// API Routes

// GET all riders with search, pagination, and filtering
app.get('/api/riders', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10, status = 'all' } = req.query;
    
    if (useLocalData) {
      // Use local JSON data
      let filteredRiders = [...localRiders];
      
      // Apply search filter
      if (search) {
        filteredRiders = filteredRiders.filter(rider => 
          rider.name.toLowerCase().includes(search.toLowerCase()) ||
          rider.email.toLowerCase().includes(search.toLowerCase()) ||
          rider.nric.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply status filter
      if (status && status !== 'all') {
        filteredRiders = filteredRiders.filter(rider => rider.status === status);
      }
      
      // Apply pagination
      const total = filteredRiders.length;
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedRiders = filteredRiders.slice(startIndex, endIndex);
      
      res.json({ riders: paginatedRiders, total });
    } else {
      // Use MongoDB
      // Build query
      let query = {};
      
      // Search by name, email, or NRIC
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { nric: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Filter by status
      if (status && status !== 'all') {
        query.status = status;
      }
      
      // Execute query with pagination
      const total = await Rider.countDocuments(query);
      const riders = await Rider.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
      
      res.json({ riders, total });
    }
  } catch (err) {
    console.error('Error fetching riders:', err);
    res.status(500).json({ error: 'Failed to fetch riders', details: [err.message] });
  }
});

// GET single rider by ID
app.get('/api/riders/:id', async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) {
      return res.status(404).json({ error: 'Rider not found', details: [] });
    }
    res.json(rider);
  } catch (err) {
    console.error('Error fetching rider:', err);
    res.status(500).json({ error: 'Failed to fetch rider', details: [err.message] });
  }
});

// POST create new rider
app.post('/api/riders', async (req, res) => {
  try {
    const errors = validateRiderFields(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    // Check if email or NRIC already exists
    const existingRider = await Rider.findOne({
      $or: [
        { email: req.body.email.toLowerCase() },
        { nric: req.body.nric }
      ]
    });
    
    if (existingRider) {
      return res.status(400).json({ 
        error: 'Rider already exists', 
        details: ['Email or NRIC already registered'] 
      });
    }
    
    const rider = new Rider(req.body);
    await rider.save();
    
    res.status(201).json(rider);
  } catch (err) {
    console.error('Error creating rider:', err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'Duplicate field', 
        details: ['Email or NRIC already exists'] 
      });
    }
    res.status(400).json({ error: 'Failed to create rider', details: [err.message] });
  }
});

// PUT update rider
app.put('/api/riders/:id', async (req, res) => {
  try {
    const errors = validateRiderFields(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    // Check if email or NRIC already exists for other riders
    const existingRider = await Rider.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { email: req.body.email.toLowerCase() },
        { nric: req.body.nric }
      ]
    });
    
    if (existingRider) {
      return res.status(400).json({ 
        error: 'Duplicate field', 
        details: ['Email or NRIC already registered by another rider'] 
      });
    }
    
    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!rider) {
      return res.status(404).json({ error: 'Rider not found', details: [] });
    }
    
    res.json(rider);
  } catch (err) {
    console.error('Error updating rider:', err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'Duplicate field', 
        details: ['Email or NRIC already exists'] 
      });
    }
    res.status(400).json({ error: 'Failed to update rider', details: [err.message] });
  }
});

// DELETE rider
app.delete('/api/riders/:id', async (req, res) => {
  try {
    const rider = await Rider.findByIdAndDelete(req.params.id);
    if (!rider) {
      return res.status(404).json({ error: 'Rider not found', details: [] });
    }
    res.json({ message: 'Rider deleted successfully' });
  } catch (err) {
    console.error('Error deleting rider:', err);
    res.status(500).json({ error: 'Failed to delete rider', details: [err.message] });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = useLocalData ? 'local_data' : (mongoose.connection.readyState === 1 ? 'connected' : 'disconnected');
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      dataSource: useLocalData ? 'local_json' : 'mongodb',
      database: {
        status: dbStatus,
        host: useLocalData ? 'local' : (mongoose.connection.host || 'unknown'),
        name: useLocalData ? 'riders.json' : (mongoose.connection.name || 'unknown'),
        records: useLocalData ? localRiders.length : 'unknown'
      },
      server: {
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      error: 'Request entity too large', 
      details: ['The image file is too large. Please use a smaller image or compress it.']
    });
  }
  
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      error: 'Invalid JSON', 
      details: ['The request body contains invalid JSON format.']
    });
  }
  
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    details: ['An unexpected error occurred. Please try again.']
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Try to connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed, falling back to local data');
    useLocalData = true;
    loadLocalData();
  }
  
  // Start server regardless of database connection
  const PORT = process.env.PORT || 5001;
  const HOST = '0.0.0.0'; // Bind to all network interfaces
  
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on ${HOST}:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Database: ${useLocalData ? 'Local JSON (fallback)' : 'MongoDB'}`);
    console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'Default'}`);
    console.log(`🌐 Network Access: http://192.168.1.71:${PORT} (or your local IP)`);
    
    // Seed initial data after server starts (only if enabled and MongoDB is connected)
    if (process.env.ENABLE_SEEDING !== 'false' && !useLocalData) {
      // Add a small delay to ensure database is fully ready
      setTimeout(() => {
        seedInitialData();
      }, 1000);
    } else if (useLocalData) {
      console.log('🌱 Using local data, seeding not required');
    } else {
      console.log('🌱 Seeding disabled via environment variable');
    }
  });
}

// Start the server
startServer();
