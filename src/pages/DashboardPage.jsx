import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hostelAPI } from '../services/apiService';
import { setAnalytics, setLoading } from '../store/hostelSlice';
import { toast } from 'react-toastify';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { owner } = useSelector((state) => state.auth);
  const { analytics, hostels } = useSelector((state) => state.hostels);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!owner) {
      navigate('/login');
      return;
    }

    fetchAnalytics();
  }, [owner, navigate]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await hostelAPI.getHostelAnalytics();
      dispatch(setAnalytics(response.data.overall));
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <p className="loading">Loading analytics...</p>
      </div>
    );
  }

  const {
    todayCollection = 0,
    monthlyCollection = 0,
    totalDues = 0,
    totalTenants = 0,
    vacantBeds = 0,
    totalBeds = 0,
    occupiedBeds = 0,
    paidTenants = 0,
    unpaidTenants = 0,
  } = analytics || {};

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {owner?.ownerName || 'Owner'}</h1>
          <p className="date">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="stats-section">
        <h2>Today's Overview</h2>
        <div className="stats-grid">
          <div className="stat-card collection">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Today's Collection</h3>
              <p className="stat-value">₹{todayCollection.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Monthly Revenue</h3>
              <p className="stat-value">₹{monthlyCollection.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="stat-card dues">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>Total Dues</h3>
              <p className="stat-value">₹{totalDues.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="stat-card occupancy">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Occupancy</h3>
              <p className="stat-value">
                {occupiedBeds}/{totalBeds} Beds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tenant Stats */}
      <section className="tenant-stats">
        <div className="tenant-card paid">
          <h3>Paid Tenants</h3>
          <p className="count">{paidTenants}</p>
        </div>
        <div className="tenant-card unpaid">
          <h3>Pending Payments</h3>
          <p className="count">{unpaidTenants}</p>
        </div>
        <div className="tenant-card total">
          <h3>Total Tenants</h3>
          <p className="count">{totalTenants}</p>
        </div>
        <div className="tenant-card vacant">
          <h3>Vacant Beds</h3>
          <p className="count">{vacantBeds}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button
            className="action-btn btn-primary"
            onClick={() => navigate('/hostels')}
          >
            <span className="btn-icon">🏢</span>
            <span>Manage Hostels</span>
          </button>
          <button
            className="action-btn btn-secondary"
            onClick={() => navigate('/tenants')}
          >
            <span className="btn-icon">👤</span>
            <span>Manage Tenants</span>
          </button>
          <button
            className="action-btn btn-tertiary"
            onClick={() => navigate('/payments')}
          >
            <span className="btn-icon">💳</span>
            <span>Track Payments</span>
          </button>
          <button
            className="action-btn btn-quaternary"
            onClick={() => navigate('/expenses')}
          >
            <span className="btn-icon">📉</span>
            <span>Log Expenses</span>
          </button>
        </div>
      </section>
    </div>
  );
}
