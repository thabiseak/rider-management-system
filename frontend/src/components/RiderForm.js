import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/api/riders`;

import { FiUser, FiMail, FiBriefcase, FiCreditCard, FiPhone, FiImage, FiAward, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaMotorcycle, FaBicycle, FaCar } from 'react-icons/fa';
import './RiderForm.css';

function RiderForm({ onSuccess, onClose, editingRider }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    position: '',
    nric: '',
    image: '',
    status: 'active',
    phone: '',
    vehicle: 'Motorcycle',
    license: '',
    rating: 4.5,
    ridesCompleted: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle image upload and convert to base64 with compression
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Please select an image smaller than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress the image before setting it
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 800x800)
          let { width, height } = img;
          const maxSize = 800;
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          
          setForm((prevForm) => ({ ...prevForm, image: compressedDataUrl }));
          setError(''); // Clear any previous errors
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (editingRider) {
      setForm({
        name: editingRider.name || '',
        email: editingRider.email || '',
        position: editingRider.position || '',
        nric: editingRider.nric || '',
        image: editingRider.image || '',
        status: editingRider.status || 'active',
        phone: editingRider.phone || '',
        vehicle: editingRider.vehicle || 'Motorcycle',
        license: editingRider.license || '',
        rating: editingRider.rating || 4.5,
        ridesCompleted: editingRider.ridesCompleted || 0
      });
    }
  }, [editingRider]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (editingRider) {
        // Update existing rider
        await axios.put(`${API_URL}/${editingRider._id}`, form);
      } else {
        // Create new rider
        await axios.post(API_URL, form);
      }
      
      setForm({ 
        name: '', 
        email: '', 
        position: '', 
        nric: '', 
        image: '', 
        status: 'active',
        phone: '',
        vehicle: 'Motorcycle',
        license: '',
        rating: 4.5,
        ridesCompleted: 0
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${editingRider ? 'update' : 'create'} rider`);
    }
    setLoading(false);
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>{editingRider ? 'Edit Rider' : 'Add New Rider'}</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter rider name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position *</label>
            <input
              type="text"
              id="position"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Enter position"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nric">NRIC *</label>
            <input
              type="text"
              id="nric"
              name="nric"
              value={form.nric}
              onChange={handleChange}
              placeholder="Enter NRIC number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Profile Image</label>
            <div className="image-upload-section">
              <div className="image-preview">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="preview-image" />
                ) : (
                  <div className="image-placeholder">
                    <span>No image selected</span>
                  </div>
                )}
              </div>
              <div className="image-inputs">
                <div className="file-input-group">
                  <label htmlFor="imageFile" className="file-input-label">
                    📁 Upload Image
                  </label>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                </div>
                <div className="url-input-group">
                  <label htmlFor="imageUrl">Or enter image URL:</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="image"
                    value={form.image}
                    onChange={(e) => setForm({...form, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="url-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="premium">Premium</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="vehicle">Vehicle</label>
            <select
              id="vehicle"
              name="vehicle"
              value={form.vehicle}
              onChange={handleChange}
            >
              <option value="Motorcycle">Motorcycle</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Car">Car</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="license">License</label>
            <input
              type="text"
              id="license"
              name="license"
              value={form.license}
              onChange={handleChange}
              placeholder="Enter license number"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (editingRider ? 'Updating...' : 'Creating...') : (editingRider ? 'Update Rider' : 'Add Rider')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RiderForm;