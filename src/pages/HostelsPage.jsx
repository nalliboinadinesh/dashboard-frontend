import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { hostelAPI } from '../services/apiService';
import { toast } from 'react-toastify';
import '../styles/hostels.css';

export default function HostelsPage() {
  const { owner } = useSelector((state) => state.auth);
  const [hostels, setHostels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    hostelName: '',
    hostelType: 'boys',
    ownerName: owner?.ownerName || '',
    email: '',
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setIsLoading(true);
      const response = await hostelAPI.listHostels();
      setHostels(response.data.hostels);
    } catch (error) {
      toast.error('Failed to load hostels');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await hostelAPI.createHostel(formData);
      toast.success('Hostel created successfully!');
      setFormData({
        hostelName: '',
        hostelType: 'boys',
        ownerName: owner?.ownerName || '',
        email: '',
      });
      setShowForm(false);
      fetchHostels();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create hostel');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hostels-container">
      <div className="hostels-header">
        <h1>My Hostels</h1>
        <button
          className="add-hostel-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add Hostel'}
        </button>
      </div>

      {showForm && (
        <div className="hostel-form-container">
          <form onSubmit={handleSubmit} className="hostel-form">
            <div className="form-group">
              <label>Hostel Name *</label>
              <input
                type="text"
                name="hostelName"
                value={formData.hostelName}
                onChange={handleInputChange}
                placeholder="e.g., Blue Valley Hostel"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hostel Type *</label>
                <select
                  name="hostelType"
                  value={formData.hostelType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="co-ed">Co-ed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Owner Name *</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="owner@example.com"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Hostel'}
            </button>
          </form>
        </div>
      )}

      {isLoading && !showForm ? (
        <p className="loading">Loading hostels...</p>
      ) : hostels.length === 0 ? (
        <div className="empty-state">
          <p>No hostels yet. Create your first hostel!</p>
        </div>
      ) : (
        <div className="hostels-grid">
          {hostels.map((hostel) => (
            <div key={hostel._id} className="hostel-card">
              <div className="hostel-header-info">
                <h2>{hostel.hostelName}</h2>
                <span className="hostel-type">{hostel.hostelType}</span>
              </div>
              <p className="hostel-owner">Owner: {hostel.ownerName}</p>
              {hostel.email && <p className="hostel-email">📧 {hostel.email}</p>}
              <div className="hostel-actions">
                <button className="btn-secondary">View</button>
                <button className="btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
