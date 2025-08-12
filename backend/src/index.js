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

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CORS_ORIGIN || '*'] 
    : ['http://localhost:3000', 'http://192.168.1.71:3000', 'http://127.0.0.1:3000'],
  credentials: true
};

app.use(cors(corsOptions));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Body parsing middleware with increased limits
app.use(express.json({ 
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  limit: '50mb', 
  extended: true 
}));

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

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Seed initial data after server starts
  seedInitialData();
});
