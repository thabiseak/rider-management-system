import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import RiderCard from './components/RiderCard';
import RiderForm from './components/RiderForm';
import RiderProfile from './components/RiderProfile';
import PremiumModal from './components/PremiumModal';
import PremiumLoader from './components/PremiumLoader';
import API_BASE_URL from './config/api';

const API_URL = `${API_BASE_URL}/api/riders`;

function App() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [selectedRider, setSelectedRider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingRider, setEditingRider] = useState(null);

  useEffect(() => {
    fetchRiders();
  }, [search, filterStatus, page]);

  useEffect(() => {
    // Apply dark mode class to body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const fetchRiders = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Fetching riders from:', API_URL);
      console.log('🔍 API_BASE_URL:', API_BASE_URL);
      const res = await axios.get(API_URL, {
        params: { search, page, limit }
      });
      console.log('✅ Response received:', res.data);
      let filteredRiders = res.data.riders;
      
      if (filterStatus !== 'all') {
        filteredRiders = filteredRiders.filter(rider => rider.status === filterStatus);
      }
      
      setRiders(filteredRiders);
      setTotal(res.data.total);
    } catch (err) {
      console.error('❌ Error fetching riders:', err);
      setError(err.response?.data?.error || 'Failed to fetch riders');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCardClick = (rider) => {
    setSelectedRider(rider);
    setShowModal(true);
  };

  const handleProfileClick = (rider) => {
    setSelectedRider(rider);
    setShowProfile(true);
  };

  const handleEditClick = (rider) => {
    setEditingRider(rider);
    setShowForm(true);
  };

  const handleDeleteClick = async (rider) => {
    if (window.confirm(`Are you sure you want to delete ${rider.name}?`)) {
      try {
        console.log('🗑️ Deleting rider:', rider._id);
        console.log('🗑️ Delete URL:', `${API_URL}/${rider._id}`);
        await axios.delete(`${API_URL}/${rider._id}`);
        console.log('✅ Rider deleted successfully');
        fetchRiders();
      } catch (err) {
        console.error('❌ Error deleting rider:', err);
        setError(err.response?.data?.error || 'Failed to delete rider');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRider(null);
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedRider(null);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEditingRider(null);
    }
  };

  const handleEditProfile = (rider) => {
    setShowProfile(false);
    setEditingRider(rider);
    setShowForm(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Calculate counts
  const totalRidersCount = riders.length;
  const activeRidersCount = riders.filter(rider => rider.status === 'active').length;
  const inactiveRidersCount = riders.filter(rider => rider.status === 'inactive').length;
  const suspendedRidersCount = riders.filter(rider => rider.status === 'suspended').length;

  // Filter riders based on search and status
  const filteredRiders = riders.filter(rider => {
    const matchesSearch = search === '' || 
      rider.name?.toLowerCase().includes(search.toLowerCase()) ||
      rider.email?.toLowerCase().includes(search.toLowerCase()) ||
      rider._id?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || rider.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle status filter click
  const handleStatusClick = (status) => {
    setFilterStatus(status);
    setPage(1);
  };

  return (
    <div className={`premium-bg ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="premium-header">
        <div className="header-top">
          <div className="header-left">
            <div className="app-icon logo-glass-bg">
              <img src="/rider-logo.svg" alt="Rider Logo" className="header-logo-img" />
            </div>
            <div>
              <h1 className="app-title">Rider Management</h1>
              <p className="app-subtitle">Manage your delivery riders efficiently</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleDarkMode} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Statistics Cards */}
        <div className="stats-overview">
          <div className={`stat-card total-riders ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => handleStatusClick('all')}>
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="url(#statTotal)" />
                <path d="M12 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="#fff"/>
                <defs>
                  <linearGradient id="statTotal" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#667eea"/>
                    <stop offset="1" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="stat-number">{totalRidersCount}</div>
            <div className="stat-label">Total Riders</div>
          </div>

          <div className={`stat-card active-riders ${filterStatus === 'active' ? 'active' : ''}`} onClick={() => handleStatusClick('active')}>
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="url(#statActive)" />
                <path d="M12 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="#fff"/>
                <defs>
                  <linearGradient id="statActive" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#059669"/>
                    <stop offset="1" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="stat-number">{activeRidersCount}</div>
            <div className="stat-label">Active Riders</div>
          </div>

          <div className={`stat-card inactive-riders ${filterStatus === 'inactive' ? 'active' : ''}`} onClick={() => handleStatusClick('inactive')}>
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="url(#statInactive)" />
                <path d="M12 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="#fff"/>
                <defs>
                  <linearGradient id="statInactive" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#dc2626"/>
                    <stop offset="1" stopColor="#ef4444"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="stat-number">{inactiveRidersCount}</div>
            <div className="stat-label">Inactive Riders</div>
          </div>

          <div className={`stat-card suspended-riders ${filterStatus === 'suspended' ? 'active' : ''}`} onClick={() => handleStatusClick('suspended')}>
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="url(#statSuspended)" />
                <path d="M12 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="#fff"/>
                <defs>
                  <linearGradient id="statSuspended" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f59e0b"/>
                    <stop offset="1" stopColor="#f97316"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="stat-number">{suspendedRidersCount}</div>
            <div className="stat-label">Suspended</div>
          </div>
        </div>

        <div className="content-header">
          <div className="search-container">
            <input
              type="text"
              className="premium-search"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={handleSearch}
            />
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </div>
          <button className="add-rider-btn" onClick={() => setShowForm(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New Rider
          </button>
        </div>

        <div className="filter-section">
          <select className="status-filter" value={filterStatus} onChange={handleStatusFilter}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="rider-count">
          Showing {filteredRiders.length} of {total} riders
        </div>

        {showForm && (
          <RiderForm 
            onSuccess={() => { 
              fetchRiders(); 
              setShowForm(false); 
              setEditingRider(null);
            }} 
            onClose={() => {
              setShowForm(false);
              setEditingRider(null);
            }}
            editingRider={editingRider}
          />
        )}
        
        {loading ? <PremiumLoader /> : null}
        {error && <div className="premium-error">{error}</div>}
        
        <div className="premium-card-list">
          {filteredRiders.map(rider => (
            <RiderCard 
              key={rider._id} 
              rider={rider} 
              onEdit={() => handleEditClick(rider)}
              onDelete={() => handleDeleteClick(rider)}
              onViewProfile={() => handleProfileClick(rider)}
            />
          ))}
        </div>
        
        <div className="premium-pagination">
          {[...Array(Math.ceil(total / limit)).keys()].map(i => (
            <button
              key={i}
              className={`premium-page-btn${page === i + 1 ? ' active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <PremiumModal rider={selectedRider} onClose={closeModal} />
      )}

      {showProfile && selectedRider && (
        <RiderProfile 
          rider={selectedRider} 
          onClose={closeProfile}
          onEdit={handleEditProfile}
        />
      )}
    </div>
  );
}

export default App;
