import React from 'react';
import './RiderProfile.css';
import { 
  User, 
  Mail, 
  Phone, 
  Car, 
  FileText, 
  MapPin, 
  Calendar, 
  Shield, 
  Zap, 
  Clock,
  Star,
  Award,
  TrendingUp,
  X,
  Edit,
  ArrowLeft
} from 'lucide-react';

const RiderProfile = ({ rider, onClose, onEdit }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Shield size={20} />;
      case 'inactive':
        return <Clock size={20} />;
      case 'premium':
        return <Zap size={20} />;
      default:
        return <User size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'premium':
        return 'status-premium';
      default:
        return 'status-default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          <button className="back-btn" onClick={onClose}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Avatar and Basic Info */}
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {rider.image ? (
                <img src={rider.image} alt={rider.name} className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  <User size={48} />
                </div>
              )}
            </div>
            
            <div className="profile-basic-info">
              <h1 className="profile-name">{rider.name}</h1>
              <div className="profile-position">
                <MapPin size={16} />
                <span>{rider.position}</span>
              </div>
              <div className={`profile-status ${getStatusColor(rider.status)}`}>
                {getStatusIcon(rider.status)}
                <span>{rider.status}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <Mail size={20} />
              <span>Contact Information</span>
            </h2>
            <div className="contact-grid">
              <div className="contact-item">
                <Mail size={16} className="contact-icon" />
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">{rider.email}</span>
                </div>
              </div>
              
              {rider.phone && (
                <div className="contact-item">
                  <Phone size={16} className="contact-icon" />
                  <div className="contact-details">
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">{rider.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Information */}
          {rider.vehicle && (
            <div className="profile-section">
              <h2 className="section-title">
                <Car size={20} />
                <span>Vehicle Information</span>
              </h2>
              <div className="vehicle-grid">
                <div className="vehicle-item">
                  <Car size={16} className="vehicle-icon" />
                  <div className="vehicle-details">
                    <span className="vehicle-label">Vehicle Type</span>
                    <span className="vehicle-value">{rider.vehicle}</span>
                  </div>
                </div>
                
                {rider.license && (
                  <div className="vehicle-item">
                    <FileText size={16} className="vehicle-icon" />
                    <div className="vehicle-details">
                      <span className="vehicle-label">License Number</span>
                      <span className="vehicle-value">{rider.license}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NRIC Information */}
          {rider.nric && (
            <div className="profile-section">
              <h2 className="section-title">
                <FileText size={20} />
                <span>Identification</span>
              </h2>
              <div className="nric-item">
                <FileText size={16} className="nric-icon" />
                <div className="nric-details">
                  <span className="nric-label">NRIC</span>
                  <span className="nric-value">{rider.nric}</span>
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="profile-section">
            <h2 className="section-title">
              <TrendingUp size={20} />
              <span>Statistics</span>
            </h2>
            <div className="stats-grid">
              <div className="stat-item">
                <Star size={16} className="stat-icon" />
                <div className="stat-details">
                  <span className="stat-value">{rider.rating || 4.5}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
              
              <div className="stat-item">
                <Award size={16} className="stat-icon" />
                <div className="stat-details">
                  <span className="stat-value">{rider.ridesCompleted || 0}</span>
                  <span className="stat-label">Rides Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <Calendar size={20} />
              <span>Account Information</span>
            </h2>
            <div className="account-item">
              <Calendar size={16} className="account-icon" />
              <div className="account-details">
                <span className="account-label">Member Since</span>
                <span className="account-value">{formatDate(rider.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button className="action-btn edit-btn" onClick={onEdit}>
            <Edit size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiderProfile; 