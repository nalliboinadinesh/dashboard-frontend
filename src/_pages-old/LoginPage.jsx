import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading, loginSuccess, loginError } from '../store/authSlice';
import { authAPI } from '../services/apiService';
import { toast } from 'react-toastify';
import '../styles/auth.css';

export default function LoginPage() {
  const [ownerNumber, setOwnerNumber] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!ownerNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const response = await authAPI.registerLogin(ownerNumber);
      const { token, owner, hostels } = response.data;

      dispatch(
        loginSuccess({
          token,
          owner: { ...owner, hostels },
        })
      );

      toast.success(
        response.status === 201 ? 'Registration successful!' : 'Welcome back!'
      );
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch(loginError(message));
      toast.error(message);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Hostel Owner Login</h1>
        <p className="subtitle">Manage your hostel efficiently</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="ownerNumber">Phone Number</label>
            <input
              type="tel"
              id="ownerNumber"
              placeholder="Enter your 10-digit phone number"
              value={ownerNumber}
              onChange={(e) => setOwnerNumber(e.target.value)}
              disabled={isLoading}
              pattern="[0-9]{10}"
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login / Register'}
          </button>
        </form>

        <p className="info-text">
          Enter your phone number to login or create a new account
        </p>
      </div>
    </div>
  );
}
