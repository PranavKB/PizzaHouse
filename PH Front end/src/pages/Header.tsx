import React, { useState } from 'react'
import type { ItemDTO, OfferDTO } from '../types/interfaces';
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from './LogoutButton';
import ItemOfferTableModal from './offers/ItemOfferTableModal';
import MapItemOfferModal from './admin/MapItemOfferModal';
import UserTypesTableModal from './admin/UserTypesTableModal';
import AddOffer from './offers/AddOffer';

interface Props {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setOffers: React.Dispatch<React.SetStateAction<OfferDTO[]>>;
    offers: OfferDTO[];
    items: ItemDTO[];
    handleSaveMapItems: (itemId: number, offerIds: number[]) => Promise<void>;
    itemOfferMap: Record<number, number[]>;
    heading: string;
}

const Header: React.FC<Props> = ({ setIsAuthenticated, setOffers, offers, items, handleSaveMapItems, itemOfferMap, heading }) => {

    const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
    const [isMapOfferOpen, setIsMapOfferOpen] = useState(false);
    const [isItemOfferOpen, setIsItemOfferOpen] = useState(false);
    const [isUserTypesOpen, setIsUserTypesOpen] = useState(false);
    const navigate = useNavigate();

    
        const handleAddOffer = () => {
            setIsAddOfferOpen(true); //  Open modal
        };
    
        const handleCloseOffer = () => {
            setIsAddOfferOpen(false); //  Close modal
        };
    

  
    return (
      <div className="sticky-header">
                        <h1>{heading}</h1>

                        <div className="header-bar">
                            <div className="header-info">                            
                              {/* <button onClick={redirectToUserTypes}>User Types</button> */}
                              <button onClick={() => setIsUserTypesOpen(true)}>User Types Table</button>
                              <button onClick={() => setIsMapOfferOpen(true)}>Map Offer</button>
                              <button onClick={() => setIsItemOfferOpen(true)}>Item Offer Table</button>
                              <button onClick={handleAddOffer}>Add Offer</button>
                              <button onClick={() => navigate('/item-list')}>Items</button>
                            </div>
                            {isAddOfferOpen && (
                                <div className="modal-backdrop">
                                <div className="modal-content">
                                    <AddOffer onClose={handleCloseOffer} setOffers={setOffers}/>
                                </div>
                                </div>
                            )}
                            <UserTypesTableModal
                              isOpen={isUserTypesOpen}
                              onClose={() => setIsUserTypesOpen(false)}
                            />
                            <MapItemOfferModal
                              isOpen={isMapOfferOpen}
                              onClose={() => setIsMapOfferOpen(false)}
                              items={items}
                              offers={offers}
                              onSave={handleSaveMapItems}
                            />
                            <ItemOfferTableModal
                              isOpen={isItemOfferOpen}
                              onClose={() => setIsItemOfferOpen(false)}
                              items={items}
                              offers={offers}
                              itemOfferMap={itemOfferMap}
                            />
                            <LogoutButton setIsAuthenticated={setIsAuthenticated} />
                        </div>
                    </div>
    )
  }



export default Header
