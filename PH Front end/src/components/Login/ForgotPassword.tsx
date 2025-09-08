import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import showNotification from '../Notification/showNotification';
import { resetPasswordRequest } from '../../services/authService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPasswordRequest(email);
      showNotification.success('Password reset link has been sent to your email');
      navigate('/login');
    } catch (error: any) {
      showNotification.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <p className={styles.forgotPasswordInfo}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className={styles.backToLogin} onClick={() => navigate('/login')}>
          <span>← Back to Login</span>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
