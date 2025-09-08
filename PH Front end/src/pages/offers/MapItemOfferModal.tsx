import React, { useState } from 'react';
import type { ItemDTO, OfferDTO } from '../../types/interfaces';
import '../../styles/modal.scss';

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
  initialItemId,
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
        <h2>Map Items to Offers</h2>

        <div>
          <label>Select Item:</label>
          <select
            value={selectedItemId ?? ''}
            onChange={(e) => setSelectedItemId(parseInt(e.target.value))}
          >
            <option value="" disabled>Select an item</option>
            {items.map(item => (
              <option key={item.itemId} value={item.itemId}>
                {item.itemName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label>Select Offers:</label>
          <div>
            {offers.map(offer => (
              <div key={offer.id}>
                <input
                  type="checkbox"
                  id={`offer-${offer.id}`}
                  checked={selectedOfferIds.includes(offer.id)}
                  onChange={() => handleOfferChange(offer.id)}
                />
                <label htmlFor={`offer-${offer.id}`}>
                  {offer.offerText}
                </label>
              </div>
            ))}
          </div>
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
