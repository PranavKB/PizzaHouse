import { useEffect, useState } from "react";
import '../../styles/table.scss';
import showNotification from "../../components/Notification/showNotification";
import { getUserTypes } from "../../services/itemService";
import type { MenuProps, UserType } from "../../types/interfaces";
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from "../LogoutButton";

const UserTypes: React.FC<MenuProps> = ({setIsAuthenticated}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [userTypes, setUserTypes] = useState<UserType[]>([]);
    const navigate = useNavigate();
  useEffect(() => {
      const fetchUserTypes = async () => {
        try {
          const response = await getUserTypes();
          setUserTypes(response);
        } catch (err: any) {
          showNotification.error('Failed to load user types.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };   
  
      fetchUserTypes();
    }, []);

    const redirectToOffers = () => {
        navigate('/offers');
    };

  return (
        <div className="header-class">
            {loading ? (
            <p>Loading...</p>
            ) : (
                <>
                    <div className="sticky-header">
                        <h1>User Types</h1>

                        <div className="header-bar">
                            <div className="header-info">
                                <button onClick={redirectToOffers}>Offers</button>
                            </div>
                            <LogoutButton setIsAuthenticated={setIsAuthenticated} />
                        </div>
                    </div>
                    <div className="table-list-container">
                        <div className="table-list-header">
                        <div className="table-cell">Name</div>
                        <div className="table-cell">Description</div>
                        </div>
                        {userTypes.map(userType => (
                        <div className="table-list-row" key={userType.id}>
                          <div className="table-cell">{userType.name}</div>
                          <div className="table-cell">{userType.description}</div>
                        </div>
                      ))}
                    </div>
                </>
            )}

            
        </div>

  )
}

export default UserTypes