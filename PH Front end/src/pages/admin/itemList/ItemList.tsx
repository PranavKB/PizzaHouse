import React, { useEffect, useState } from 'react';
import '../../../styles/admin/itemList.scss';
import type { ItemDTO, MenuProps, OfferDTO } from '../../../types/interfaces';
import { getItemsDTO } from '../../../services/itemService';
import showNotification from '../../../components/Notification/showNotification';
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from '../../LogoutButton';

const ItemList: React.FC<MenuProps> = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemDTO | null>(null);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchItemsData = async () => {
      try {
        const data = await getItemsDTO();
        setItems(data);
        console.log('Fetched items:', data);
      } catch {
        showNotification.error('Failed to load items.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemsData();
  }, []);

  const redirectToOffers = () => {
        navigate('/offers');
    };

  return (
<>
    <div className="header-class">
                {loading ? (
                <p>Loading...</p>
                ) : (
                    <>
                        <div className="sticky-header">
                            
    
                            <div className="header-bar">
                                <div className="header-info">
                                    <button onClick={redirectToOffers}>Offers</button>
                                </div>
                                <div><h1>Items</h1></div>
                                <LogoutButton setIsAuthenticated={setIsAuthenticated} />
                            </div>
                        </div>
                        <div className="table-list-container">
                            <div className="table-list-header">
                                <div className="table-cell">#</div>
                              <div className="table-cell">Name</div>
                              <div className="table-cell">Description</div>
                              <div className="table-cell">Price</div>
                              <div className="table-cell">Type</div>
                              <div className="table-cell">Veg/Non-Veg</div>
                            </div>
                            {items.map((item, index) => (
                            <div  key={item.itemId} 
                                  onClick={() => setSelectedItem(item)}
                                  className={`table-list-row clickable-row ${selectedItem?.itemId === item.itemId ? 'selected' : ''}`}
                            >
                              <div className="table-cell">{index + 1}</div>
                              <div className="table-cell">{item.itemName}</div>
                              <div className="table-cell">{item.description}</div>
                              <div className="table-cell">{item.itemPrice}</div>
                              <div className="table-cell">{item.itemTypeName}</div>
                              <div className={`table-cell ${item.isVeg ? 'veg' : 'non-veg'}`}>
                                {item.isVeg ? 'Veg' : 'Non-Veg'}
                              </div>
                            </div>
                          ))}
                        </div>
                    </>
                )}
    
                
            </div>


      {/* Selected Item Offers */}
      {selectedItem && (
        <div className="item-offers">
          <h3>Offers for: {selectedItem.itemName}</h3>
          {selectedItem.offers?.length === 0 ? (
            <p>No offers mapped.</p>
          ) : (
            <ul className="offer-list">
                {selectedItem.offers?.map((offer) => {
                    const offerInfo = offer as OfferDTO;
                    return (
                    <li key={offerInfo.id} className="offer-item">
                        <strong>{offerInfo.offerText}</strong> —{' '}
                        {offerInfo.discountType === 'FLAT'
                        ? `₹${offerInfo.discountValue}`
                        : `${offerInfo.discountValue}%`}
                        <br />
                        <small>
                        {new Date(offerInfo.validFrom).toLocaleString()} →{' '}
                        {new Date(offerInfo.validTo).toLocaleString()}
                        </small>
                    </li>
                    );
                })}
                </ul>

          )}

          <button
            className="map-offer-btn"
            onClick={() => showNotification.info('Map offer modal to be implemented')}
          >
            + Map New Offer
          </button>
        </div>
      )}
</>


    )}
export default ItemList;
