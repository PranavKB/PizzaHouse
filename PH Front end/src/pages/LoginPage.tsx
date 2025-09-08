import React from 'react';
import Login from '../components/Login/Login';
import type { LoginPageProps } from '../types/interfaces';



const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  return <Login setIsAuthenticated={setIsAuthenticated} />;
};

export default LoginPage;
