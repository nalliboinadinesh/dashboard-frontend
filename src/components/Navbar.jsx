import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import '../styles/navbar.css';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { owner } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>🏢 Tenora</h2>
        </div>

        <div className="navbar-menu">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/hostels" className="nav-link">Hostels</a>
          <a href="/tenants" className="nav-link">Tenants</a>
          <a href="/payments" className="nav-link">Payments</a>
          <a href="/tickets" className="nav-link">Support</a>
        </div>

        <div className="navbar-right">
          <div className="owner-info">
            <span className="owner-name">{owner?.ownerName || 'Owner'}</span>
            <span className="owner-number">{owner?.ownerNumber}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
