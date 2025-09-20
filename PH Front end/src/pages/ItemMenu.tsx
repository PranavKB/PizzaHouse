import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useItemsContext } from '../context/ItemsContext';
import { useCart, type CartItem } from '../context/CartContext';
import '../styles/itemMenu.scss';
import { useNavigate } from 'react-router-dom';
import showNotification from '../components/Notification/showNotification';
import Counter from '../components/Counter/Counter';
import { LogoutButton } from './LogoutButton';
import ImageFromBlob from './ImageFromBlob';
import type { ItemDTO, MenuProps } from '../types/interfaces';
import { clearCartApi, getUserCart, placeOrder } from '../services/orderService';

const ItemMenu: React.FC<MenuProps> = () => {
  const { items, loading, error, refreshItems } = useItemsContext();
  const {
    cart,
    addToCart,
    decrementItem,
    clearCart,
    setCart,
    isOfferActiveFn,
    getBestOffer,
    getDiscountedPrice,
    cartOrderId,
    setCartOrderId,
    quantities,
    setQuantities,
    visibleCounters,
    setVisibleCounters,
  } = useCart();

  const initialCartQuantitiesRef = useRef<Record<number, number>>({});
  const [filter, setFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');

  const navigate = useNavigate();

  useEffect(() => {
    if (!items || items.length === 0) {
      refreshItems();
    }
  }, [items, refreshItems]);

  useEffect(() => {
    if (items && items.length > 0) {
      fetchCartFromApi();
    }
  }, [items]);

  const fetchCartFromApi = async () => {
    try {
      const data = await getUserCart(); 
      setQuantities(data);
      setVisibleCounters(new Set(Object.keys(data).map((id) => parseInt(id))));
      initialCartQuantitiesRef.current = data;

      const updatedCart = Object.entries(data).map(([itemIdStr, qty]) => {
        const itemId = parseInt(itemIdStr);
        const item = items.find((i) => i.itemId === itemId);
        if (!item) {
          console.warn(`Item ${itemId} not found`);
          return null;
        }
        return {
          ...item,
          quantity: Number(qty),
        };
      }).filter((i): i is CartItem => i !== null);

      setCart(updatedCart);
    } catch (err) {
      showNotification.error('Failed to load cart.');
      console.error(err);
    }
  };

  useEffect(() => {
    const newQuantities: Record<number, number> = {};
    const counters = new Set<number>();
    if(cart.length === 0) {
      setQuantities({});
      setVisibleCounters(new Set());
      return;
    }
    cart.forEach(({ itemId, quantity }) => {
      newQuantities[itemId] = quantity;
      if (quantity > 0) counters.add(itemId);
    });
    setQuantities(newQuantities);
    setVisibleCounters(counters);
  }, [cart]);

  const handleIncrement = (item: ItemDTO) => {
    const newQty = (quantities[item.itemId] || 0) + 1;
    addToCart(item, 1);
    setQuantities((prev) => ({ ...prev, [item.itemId]: newQty }));
    setVisibleCounters((prev) => new Set(prev).add(item.itemId));
  };

  const handleDecrement = (item: ItemDTO) => {
    const currentQty = quantities[item.itemId] || 0;
    if (currentQty > 0) {
      decrementItem(item.itemId);
      const newQty = currentQty - 1;
      if (newQty > 0) {
        setQuantities((prev) => ({ ...prev, [item.itemId]: newQty }));
      } else {
        setQuantities((prev) => {
          const copy = { ...prev };
          delete copy[item.itemId];
          return copy;
        });
        setVisibleCounters((prev) => {
          const copy = new Set(prev);
          copy.delete(item.itemId);
          return copy;
        });
      }
    }
  };

  const handleReset = (item: ItemDTO) => {
    const currentQty = quantities[item.itemId] || 0;
    if (currentQty > 0) {
      setCart((prev) =>
        prev
          .map((i) => (i.itemId === item.itemId ? { ...i, quantity: 0 } : i))
          .filter((i) => i.quantity > 0)
      );
      setQuantities((prev) => {
        const copy = { ...prev };
        delete copy[item.itemId];
        return copy;
      });
      setVisibleCounters((prev) => {
        const copy = new Set(prev);
        copy.delete(item.itemId);
        return copy;
      });
    }
  };

    const isCartChanged = () => {
      const original = initialCartQuantitiesRef.current;
      const keys1 = Object.keys(original);
      const keys2 = Object.keys(quantities);

      if (keys1.length !== keys2.length) return true;

      for (let key of keys1) {
        if (quantities[+key] !== original[+key]) {
          return true;
        }
      }
      return false;
    };

  const saveCartItems = () => {
    setCart(
      items
        .filter((item) => quantities[item.itemId])
        .map((item) => ({
          ...item,
          quantity: quantities[item.itemId] || 0,
        }))
    );
    saveCartItemsCall();
    initialCartQuantitiesRef.current = { ...quantities };
  }
  const saveCartItemsCall = async () => {
    if (!isCartChanged()) return; // Skip if cart unchanged

    const order = Object.fromEntries(
      Object.entries(quantities).filter(([_, qty]) => qty > 0)
    );
    await addToCartApiCall(order);
  };

  const handleCheckout = () => {
    saveCartItems();
    navigate('/checkout');
  };

  const handleAddToCartFirst = (item: ItemDTO) => {
    addToCart(item, 1);
    setQuantities((prev) => ({ ...prev, [item.itemId]: 1 }));
    setVisibleCounters((prev) => new Set(prev).add(item.itemId));
  };

  const handleClearCart = () => {
    clearCart();    
    clearCartApiCall();
  };

    const addToCartApiCall = async (order: Record<number, number>) => {
      try {
        console.log("cartOrderId:", cartOrderId );
        const data = await placeOrder(order, 1);
        if (data) setCartOrderId(data.orderId);
        showNotification.success('Items saved to cart.');
      } catch (err: any) {
        showNotification.error('Failed to add to cart.');
        console.error(err);
      }
    };

  const clearCartApiCall = async () => {
    try {
      await clearCartApi();
    } catch (err) {
      showNotification.error('Failed to clear cart on server.');
      console.error(err);
    }
  };

  const totalItems = useMemo(
    () => Object.values(quantities).reduce((sum, qty) => sum + qty, 0),
    [quantities]
  );

  if (loading) {
    return <p>Loading items...</p>;
  }

  if (error) {
    return <p>Error loading items: {error}</p>;
  }

  return (
    <div className="item-selection">
      <div className="sticky-header">
        <h1>Select Your Pizza</h1>
         <div className="filter-buttons">
              <button
                className={`ALL ${filter === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilter('ALL')}
              >
                All
              </button>
              <button
                className={`VEG ${filter === 'VEG' ? 'active' : ''}`}
                onClick={() => setFilter('VEG')}
              >
                Veg
              </button>
              <button
                className={`NON_VEG ${filter === 'NON_VEG' ? 'active' : ''}`}
                onClick={() => setFilter('NON_VEG')}
              >
                Non-Veg
              </button>
            </div>
        <div className="cart-bar">
          <div className="cart-info">
            <span>
              Cart: <strong>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''}
            </span>
            <button onClick={handleCheckout}>Checkout</button>
            <button onClick={saveCartItems}>Save Cart</button>
            <button onClick={handleClearCart}>Clear Cart</button>
            <button onClick={() => navigate('/order-history')}>Order History</button>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="item-grid">
        {items
          .filter((item) => {
                  if (filter === 'ALL') return true;
                  if (filter === 'VEG') return item.isVeg;
                  if (filter === 'NON_VEG') return !item.isVeg;
                  return true;
                })
          .map((item) => {
            const activeOffers = (item.offers || []).filter(isOfferActiveFn);
            const bestOffer = getBestOffer(item);
            const discountedPrice = getDiscountedPrice(item, bestOffer);

            return (
              <div className="item-card" key={item.itemId}>
                {item.imageUrl.startsWith('image/view/') ? (
                  <ImageFromBlob imagePath={item.imageUrl} alt={item.itemName} />
                ) : item.imageUrl.startsWith('images/') ? (
                  <img
                    src={`src/assets/${item.imageUrl}`}
                    alt={item.itemName}
                  />
                ) : (
                  <img src="/images/fallback.jpg" alt="No Image" />
                )}

                {activeOffers.length > 0 && (
                  <div className="offer-tags">
                    {activeOffers.map((offer, idx) => (
                      <div
                        key={idx}
                        className={
                          offer.discountType === 'FLAT'
                            ? 'offer-tag-top'
                            : offer.discountType === 'PERCENTAGE'
                            ? 'offer-tag green-tag'
                            : 'offer-ribbon'
                        }
                      >
                        {offer.offerText}
                      </div>
                    ))}
                  </div>
                )}

                <h3>{item.itemName}</h3>
                <p>
                  ₹{discountedPrice.toFixed(2)}
                  {bestOffer && bestOffer.discountType !== 'BOGO' && (
                    <span className="original-price">
                      ₹{item.itemPrice.toFixed(2)}
                    </span>
                  )}
                </p>

                {visibleCounters.has(item.itemId) ? (
                  <Counter
                    value={quantities[item.itemId] || 0}
                    onIncrement={() => handleIncrement(item)}
                    onDecrement={() => handleDecrement(item)}
                    onReset={() => handleReset(item)}
                  />
                ) : (
                  <button onClick={() => handleAddToCartFirst(item)}>
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ItemMenu;
