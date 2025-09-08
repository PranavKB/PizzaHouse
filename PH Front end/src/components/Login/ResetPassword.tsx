import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.scss';
import showNotification from '../Notification/showNotification';
import { resetPassword } from '../../services/authService';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get token from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      showNotification.error('Reset token is missing');
      navigate('/login');
      return;
    }
    setToken(resetToken);
  }, [location, navigate]);

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      showNotification.error('Password should be at least 8 characters, include one digit, one lowercase letter, one uppercase letter, and one special character.');
      return;
    }

    if (password !== confirmPassword) {
      showNotification.error('Passwords do not match');
      return;
    }

    if (!token) {
      showNotification.error('Reset token is missing');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      showNotification.success('Password has been reset successfully');
      navigate('/login');
    } catch (error: any) {
      showNotification.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <div className={styles.backToLogin} onClick={() => navigate('/login')}>
          <span>← Back to Login</span>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
