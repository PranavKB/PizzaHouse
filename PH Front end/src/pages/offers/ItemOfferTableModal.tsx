import React from 'react';
import type { OfferDTO } from '../../types/interfaces';
import '../../styles/modal.scss';
import { useItemsContext } from '../../context/ItemsContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  offers: OfferDTO[];
  itemOfferMap: Record<number, number[]>;
}

const ItemOfferTableModal: React.FC<Props> = ({
  isOpen,
  onClose,
  offers,
  itemOfferMap
}) => {

  const { items } = useItemsContext();
const offerIdMap: Record<number, OfferDTO> = Array.isArray(offers)
  ? offers.reduce((map, offer) => {
      map[offer.id] = offer;
      return map;
    }, {} as Record<number, OfferDTO>)
  : {};

  const handleOfferMapping = (itemId: number) => {
    var res = '';
    if (itemOfferMap[itemId]?.length > 0) {
        for (const offerId of itemOfferMap[itemId]) {
            res = res + offerIdMap[offerId]?.offerText + ', ';
        }
    }
    return res == '' ? 'No offers' : res;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay modal-backdrop">
      <div className="modal-content">
        <h2> Item Offers Table</h2>

        <div className="table-list-container">
                <div className="table-list-header">
                    <div className="table-cell">Item Name</div>
                    <div className="table-cell">Offers</div>
                </div>
        

        {items?.map(item => (
            <div className="table-list-row" key={item.itemId}>
                <div className="table-cell">{item.itemName}</div>
                <div className="table-cell">
                {}
                    {handleOfferMapping(item.itemId)}
                </div>
            </div>
            ))}

        </div>

        <div className='button-group' >
          <button onClick={onClose} className='cancel-btn'>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ItemOfferTableModal;
