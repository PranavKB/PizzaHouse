import React, { useState } from 'react';
import styles from './Login.module.scss';
import { loginUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import type { LoginPageProps } from '../../types/interfaces';


const Login: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate(); //  Add this
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.user.role);
      setIsAuthenticated(true); 
      if(response.user.role == 'Customer'){
        navigate('/menu');
      }else{
        navigate('/userTypes');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () =>{
    navigate('/register');
  }

  const handleForgotPassword = () =>{
    navigate('/forgot-password');
  }

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login to Order Pizza</h2>

        {error && <p className={styles.error}>{error}</p>}

        <label>Email</label>
        <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className={styles.forgotPassword} onClick={handleForgotPassword}><span>Forgot Password?</span></div>
        <div className={styles.registerUser} onClick={handleRegister}><span>New User? Register</span></div>
      </form>
      
    </div>
  );
};

export default Login;
