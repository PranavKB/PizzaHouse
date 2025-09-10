import React, { useEffect, useState } from 'react';
import '../../../styles/admin/itemList.scss';
import type { ItemDTO, MenuProps, OfferDTO } from '../../../types/interfaces';
import { getItemsDTO } from '../../../services/itemService';
import showNotification from '../../../components/Notification/showNotification';
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from '../../LogoutButton';
import MapItemOfferModal from '../MapItemOfferModal';
import { getOffersDTO, mapItemToOffers } from '../../../services/offerService';
import AddNewItem from './AddNewItem';

const ItemList: React.FC<MenuProps> = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [offers, setOffers] = useState<OfferDTO[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemDTO | null>(null);

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isMapOfferOpen, setIsMapOfferOpen] = useState(false);
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
    const fetchOffers = async () => {
        try {
          const response = await getOffersDTO();
          setOffers(response);
        } catch (err: any) {
          showNotification.error('Failed to load offers.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

    fetchItemsData();
    fetchOffers();
  }, []);

  const handleOnSelectItem = (item: ItemDTO) => () => {
    setSelectedItem(item);
    setIsMapOfferOpen(true);
  };

  const redirectToOffers = () => {
        navigate('/offers');
    };

    const handleOfferMapping = (item: ItemDTO) => {
        var res = '';
        if(item.offers?.length > 0) {
            for (const offer of item.offers) {
                res = res + offer.offerText + ', ';
            }
        return res == '' ? 'No offers' : res;
    };
    return 'No offers';
  };

  const handleSaveMapItems = async (itemId: number, offerIds: number[]) => {
          await mapItemToOffers(itemId, offerIds);
          const updatedItems = items.map(item => {
            if (item.itemId === itemId) {
              return {
                ...item,
                offers: offers.filter(offer => offerIds.includes(offer.id))
              };
            }
            return item;
          });
          setItems(updatedItems);
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
                                    <button onClick={() => setIsAddItemOpen(true)}>Add Item</button>
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
                              <div className="table-cell">Offers</div>
                            </div>
                            {items.map((item, index) => (
                            <div  key={item.itemId} 
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
                              <div className="table-cell link-cell" 
                                  onClick={handleOnSelectItem(item)}
                                  >{handleOfferMapping(item)}</div>
                            </div>
                          ))}
                        </div>
                    </>
                )}
    
                
            </div>

            {isMapOfferOpen && (
              <MapItemOfferModal
                isOpen={true}
                onClose={() => setIsMapOfferOpen(false)}
                items={items}
                offers={offers}
                onSave={handleSaveMapItems}
                initialItemId={selectedItem?.itemId || 0}
                initialOfferIds={selectedItem?.offers?.map(offer => offer.id) || []}
              />
            )}

            {isAddItemOpen && (
              <div className="modal-backdrop">
                  <div className="modal-content">
                    <AddNewItem onClose={() => setIsAddItemOpen(false)} setItems={setItems} />
                  </div>
                  </div>
            )}


</>


    )
}

export default ItemList;
