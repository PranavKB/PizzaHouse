import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export const LogoutButton = () => {
    
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
  const handleLogout = async () => {
          try {
            await logoutUser();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('email');
            localStorage.removeItem('role'); // if you use token auth
            setIsAuthenticated(false);
            navigate('/login');
          } catch (error) {
            console.error('Logout failed:', error);
          }
        };

  return (
  <div className="logout-info">
    <button className="logout-button" onClick={handleLogout}>
                              Logout
          </button>
  </div>);
};
