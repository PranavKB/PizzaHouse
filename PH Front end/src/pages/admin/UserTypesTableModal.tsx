import React, { useEffect, useState } from 'react';
import type { UserType } from '../../types/interfaces';
import '../../styles/modal.scss';
import { getUserTypes } from '../../services/itemService';
import showNotification from '../../components/Notification/showNotification';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UserTypesTableModal: React.FC<Props> = ({
  isOpen,
  onClose
}) => {

    
    const [loading, setLoading] = useState<boolean>(true);
    const [userTypes, setUserTypes] = useState<UserType[]>([]);


    useEffect(() => {
        setLoading(true);
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


  if (!isOpen) return null;

  return (
    <div className="modal-overlay modal-backdrop">
      <div className="modal-content">
        <h2> User Types Table</h2>

        <div className="table-list-container">
                <div className="table-list-header">
                    <div className="table-cell">User Type Name</div>
                    <div className="table-cell">Description</div>
                </div>
                {userTypes.map(userType => (
                        <div className="table-list-row" key={userType.id}>
                          <div className="table-cell">{userType.name}</div>
                          <div className="table-cell">{userType.description}</div>
                        </div>
                      ))}
        

        </div>

        <div className="button-group" >
          <button className='cancel-btn' onClick={onClose} >Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UserTypesTableModal;
