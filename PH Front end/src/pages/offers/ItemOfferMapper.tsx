import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { Item, MenuProps, Offer } from '../../types/interfaces';
import { getItems } from '../../services/itemService';
import { getOffers } from '../../services/offerService';

const ItemOfferMapper: React.FC<MenuProps> = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedOfferIds, setSelectedOfferIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getItems();
      setItems(data);
      const offerData = await getOffers();
      setOffers(offerData);
    };
    fetchData();
  }, []);


  const handleOfferChange = (offerId: number) => {
    setSelectedOfferIds(prev =>
      prev.includes(offerId)
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedItemId || selectedOfferIds.length === 0) {
      alert("Select item and at least one offer.");
      return;
    }

    await axios.post('/api/item-offers', {
      itemId: selectedItemId,
      offerIds: selectedOfferIds
    });

    alert("Mapping saved successfully!");
    setSelectedOfferIds([]);
  };

  return (
    <div>
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
            <div key={offer.offerId}>
              <input
                type="checkbox"
                id={`offer-${offer.offerId}`}
                checked={selectedOfferIds.includes(offer.offerId)}
                onChange={() => handleOfferChange(offer.offerId)}
              />
              <label htmlFor={`offer-${offer.offerId}`}>
                {offer.offerText}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button style={{ marginTop: '1rem' }} onClick={handleSubmit}>
        Save Mapping
      </button>
    </div>
  );
};

export default ItemOfferMapper;
