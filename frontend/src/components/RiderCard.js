import React from 'react';
import './RiderCard.css';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Car,
  Edit,
  Trash2,
  Eye,
  Zap,
  Clock
} from 'lucide-react';

const RiderCard = ({ rider, onEdit, onDelete, onViewProfile }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" fill="#059669" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="12" cy="12" r="4" fill="#ffffff" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          </svg>
        );
      case 'inactive':
        return <Clock size={16} />;
      case 'premium':
        return <Zap size={16} />;
      default:
        return <User size={16} />;
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

  return (
    <div className="rider-card">
      <div className="card-header">
        <div className="rider-avatar">
          {rider.image ? (
            <img src={rider.image} alt={rider.name} className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <User size={24} />
            </div>
          )}
        </div>
        
        <div className="rider-info">
          <div className="rider-name-section">
            <h3 className="rider-name">{rider.name}</h3>
            <div className={`status-badge ${getStatusColor(rider.status)}`}>
              {getStatusIcon(rider.status)}
              <span>{rider.status}</span>
            </div>
          </div>
          
          <div className="rider-position">
            <MapPin size={14} />
            <span>{rider.position}</span>
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="contact-info">
          <div className="contact-item">
            <Mail size={16} className="contact-icon" />
            <span className="contact-text">{rider.email}</span>
          </div>
          
          {rider.phone && (
            <div className="contact-item">
              <Phone size={16} className="contact-icon" />
              <span className="contact-text">{rider.phone}</span>
            </div>
          )}
        </div>

        {rider.vehicle && (
          <div className="vehicle-section">
            <div className="section-title">
              <Car size={16} />
              <span>Vehicle Details</span>
            </div>
            <div className="vehicle-info">
              <div className="vehicle-item">
                <span className="vehicle-label">Vehicle:</span>
                <span className="vehicle-value">{rider.vehicle}</span>
              </div>
              {rider.license && (
                <div className="vehicle-item">
                  <span className="vehicle-label">License:</span>
                  <span className="vehicle-value">{rider.license}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {rider.nric && (
          <div className="nric-section">
            <div className="section-title">
              <span>NRIC</span>
            </div>
            <span className="nric-value">{rider.nric}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button className="action-btn view-btn" onClick={onViewProfile}>
          <Eye size={16} />
          <span>View</span>
        </button>
        
        <button className="action-btn edit-btn" onClick={onEdit}>
          <Edit size={16} />
          <span>Edit</span>
        </button>
        
        <button className="action-btn delete-btn" onClick={onDelete}>
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default RiderCard;
