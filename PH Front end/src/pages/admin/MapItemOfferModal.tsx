import React, { useState } from 'react';
import type { ItemDTO, OfferDTO } from '../../types/interfaces';
import '../../styles/modal.scss';
import { convertToUIDateTime } from '../../services/offerService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: ItemDTO[];
  offers: OfferDTO[];
  onSave: (itemId: number, offerIds: number[]) => void;
  initialItemId?: number;
  initialOfferIds?: number[];
}

const MapItemOfferModal: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  offers,
  onSave,
  initialItemId = 0,
  initialOfferIds = []
}) => {
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(initialItemId);
  const [selectedOfferIds, setSelectedOfferIds] = useState<number[]>(initialOfferIds);


  const handleOfferChange = (offerId: number) => {
    setSelectedOfferIds(prev =>
      prev.includes(offerId)
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleItemSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItemId(parseInt(e.target.value));
  }

  const handleSubmit = () => {
    if (selectedItemId) {
      onSave(selectedItemId, selectedOfferIds);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay modal-backdrop">
      <div className="modal-content">
        <div>
        <h2>Map Items to Offers</h2>

        <div>
          <label>Select Item:</label>
          <select
            value={selectedItemId ?? ''}
            onChange={handleItemSelect}
          >
            <option value="" disabled>Select an item</option>
            {items.map(item => (
              <option key={item.itemId} value={item.itemId}>
                {item.itemName}
              </option>
            ))}
          </select>
        </div>
        </div>
        <div className="table-list-container">
          <div className="table-list-header">
            <div className="table-cell "></div>
            <div className="table-cell">Offer Text</div>
            <div className="table-cell">Discount Type</div>
            <div className="table-cell">valid From</div>
            <div className="table-cell">valid To</div>
          </div>
          {offers.map(offer => (
            <div className="table-list-row" key={offer.id}>
              <div className="table-cell">
                <input
                  type="checkbox"
                  id={`offer-${offer.id}`}
                  checked={selectedOfferIds.includes(offer.id)}
                  onChange={() => handleOfferChange(offer.id)}
                />
              </div>
              <div className="table-cell">
                <label htmlFor={`offer-${offer.id}`}>
                  {offer.offerText}
                </label>
              </div>
              <div className="table-cell">{offer.discountType}</div>
              <div className="table-cell">{convertToUIDateTime(offer.validFrom)}</div>
              <div className="table-cell">{convertToUIDateTime(offer.validTo)}</div>
            </div>
          ))}
        </div>

        <div className='button-group' style={{ marginTop: '1rem' }}>
          <button onClick={handleSubmit} className='submit-btn'>Save Mapping</button>
          <button onClick={onClose} className='cancel-btn'>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MapItemOfferModal;
