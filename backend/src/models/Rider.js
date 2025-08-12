const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  nric: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    default: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'premium', 'suspended'],
    default: 'active'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  vehicle: {
    type: String,
    enum: ['Motorcycle', 'Bicycle', 'Car'],
    default: 'Motorcycle'
  },
  license: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  },
  ridesCompleted: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Note: unique: true automatically creates indexes, so we don't need schema.index()

module.exports = mongoose.model('Rider', riderSchema);
