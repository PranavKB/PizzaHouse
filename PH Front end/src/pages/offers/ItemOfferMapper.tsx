import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { Item, MenuProps, OfferDTO } from '../../types/interfaces';
import { getItemsDTO } from '../../services/itemService';
import { getOffersDTO } from '../../services/offerService';

const ItemOfferMapper: React.FC<MenuProps> = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [offers, setOffers] = useState<OfferDTO[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedOfferIds, setSelectedOfferIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getItemsDTO();
      setItems(data);
      const offerData = await getOffersDTO();
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

      <button style={{ marginTop: '1rem' }} onClick={handleSubmit}>
        Save Mapping
      </button>
    </div>
  );
};

export default ItemOfferMapper;
