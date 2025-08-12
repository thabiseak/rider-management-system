import React from 'react';
import './PremiumModal.css';

const PremiumModal = ({ rider, onClose, onEdit, onDelete, onProfile }) => {
  if (!rider) return null;

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#f59e0b';
      case 'suspended':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'inactive':
        return '🟡';
      case 'suspended':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>Rider Details</h2>
            <span className="modal-subtitle">Premium Information</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="rider-profile-section">
            <div className="profile-image-container">
              {rider.image ? (
                <img 
                  src={rider.image} 
                  alt={rider.name}
                  className="profile-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="profile-initials" style={{ display: rider.image ? 'none' : 'flex' }}>
                {getInitials(rider.name)}
              </div>
            </div>
            
            <div className="profile-info">
              <h3 className="rider-name">{rider.name}</h3>
              <p className="rider-position">{rider.position}</p>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(rider.status) + '20', color: getStatusColor(rider.status) }}>
                {getStatusIcon(rider.status)} {rider.status.charAt(0).toUpperCase() + rider.status.slice(1)}
              </div>
            </div>
          </div>

          <div className="rider-details">
            <div className="detail-group">
              <h4>📧 Contact Information</h4>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{rider.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{rider.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="detail-group">
              <h4>🆔 Identification</h4>
              <div className="detail-item">
                <span className="detail-label">NRIC:</span>
                <span className="detail-value">{rider.nric}</span>
              </div>
            </div>

            <div className="detail-group">
              <h4>🚗 Vehicle Information</h4>
              <div className="detail-item">
                <span className="detail-label">Vehicle:</span>
                <span className="detail-value">{rider.vehicle || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">License:</span>
                <span className="detail-value">{rider.license || 'Not provided'}</span>
              </div>
            </div>

            <div className="detail-group">
              <h4>📊 Statistics</h4>
              <div className="detail-item">
                <span className="detail-label">Rating:</span>
                <span className="detail-value">⭐ {rider.rating || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rides Completed:</span>
                <span className="detail-value">{rider.ridesCompleted || 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Joined:</span>
                <span className="detail-value">{formatDate(rider.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="action-btn profile-btn" onClick={() => onProfile(rider)}>
            <span>👤</span>
            <span>Profile</span>
          </button>
          <button className="action-btn edit-btn" onClick={() => onEdit(rider)}>
            <span>✏️</span>
            <span>Edit</span>
          </button>
          <button className="action-btn delete-btn" onClick={() => onDelete(rider)}>
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
