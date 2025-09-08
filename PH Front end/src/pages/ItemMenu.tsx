import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getItemsDTO } from '../services/itemService';
import { clearCartApi, getUserCart, placeOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import { useCart, type CartItem } from '../context/CartContext';
import showNotification from '../components/Notification/showNotification';
import Counter from '../components/Counter/Counter';
import '../styles/itemMenu.scss';
import type { ItemDTO, MenuProps } from '../types/interfaces';
import { LogoutButton } from './LogoutButton';

const ItemMenu: React.FC<MenuProps> = ({ setIsAuthenticated }) => {
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [visibleCounters, setVisibleCounters] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');

  const navigate = useNavigate();
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
  } = useCart();

  const initialCartQuantitiesRef = useRef<Record<number, number>>({});

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

  useEffect(() => {
    if (items.length > 0) {
      fetchCart(); // Safe to call now
    }
  }, [items]);

  useEffect(() => {
    const newQuantities: Record<number, number> = {};
    const counters = new Set<number>();

    cart.forEach(({ itemId, quantity }) => {
      newQuantities[itemId] = quantity;
      if (quantity > 0) counters.add(itemId);
    });

    setQuantities(newQuantities);
    setVisibleCounters(counters);
  }, [cart]);

const fetchCart = async () => {
  try {
    const data = await getUserCart(); // example: { "1": 2, "3": 1 }

    setQuantities(data);
    setVisibleCounters(new Set(Object.keys(data).map((id) => parseInt(id))));
    initialCartQuantitiesRef.current = data;

    //   cart
    const updatedCart = Object.entries(data).map(([itemIdStr, quantity]) => {
      const itemId = parseInt(itemIdStr);
      const item = items.find((i) => i.itemId === itemId);

      if (!item) {
        console.warn(`Item with ID ${itemId} not found in 'items' list.`);
        return null;
      }

      return {
        ...item,
        quantity: Number(quantity),
      };
    }).filter((item): item is CartItem => item !== null); // type guard

    setCart(updatedCart);
  } catch (err) {
    showNotification.error('Failed to load cart.');
    console.error(err);
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

  const handleIncrement = (item: ItemDTO) => {
    const newQty = (quantities[item.itemId] || 0) + 1;
    addToCart(item);
    setQuantities((prev) => ({ ...prev, [item.itemId]: newQty }));
    setVisibleCounters((prev) => new Set(prev).add(item.itemId));
  };

  const handleDecrement = (item: ItemDTO) => {
    const currentQty = quantities[item.itemId] || 0;
    if (currentQty > 1) {
      decrementItem(item.itemId);
      setQuantities((prev) => ({ ...prev, [item.itemId]: currentQty - 1 }));
    } else {
      decrementItem(item.itemId);
      setQuantities((prev) => {
        const updated = { ...prev };
        delete updated[item.itemId];
        return updated;
      });
      setVisibleCounters((prev) => {
        const updated = new Set(prev);
        updated.delete(item.itemId);
        return updated;
      });
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
        const updated = { ...prev };
        delete updated[item.itemId];
        return updated;
      });
      setVisibleCounters((prev) => {
        const updated = new Set(prev);
        updated.delete(item.itemId);
        return updated;
      });
    }
  };

  const handleAddToCart = (item: ItemDTO) => {
    addToCart(item, 1);
    setQuantities((prev) => ({ ...prev, [item.itemId]: 1 }));
    setVisibleCounters((prev) => new Set(prev).add(item.itemId));
  };

  const handleClearCart = () => {
    clearCart();
    setQuantities({});
    setVisibleCounters(new Set());
    clearCartApiCall();
  };

  const handleOrderHistory = () => {
    navigate('/order-history');
  };

  const saveCartItems = async () => {
    if (!isCartChanged()) return; // Skip if cart unchanged

    const order = Object.fromEntries(
      Object.entries(quantities).filter(([_, qty]) => qty > 0)
    );
    await addToCartApiCall(order);
  };

  const handleCheckout = () => {
    setCart(
      items
        .filter((item) => quantities[item.itemId])
        .map((item) => ({
          ...item,
          quantity: quantities[item.itemId] || 0,
        }))
    );
    saveCartItems();
    navigate('/checkout');
  };

  const addToCartApiCall = async (order: Record<number, number>) => {
    try {
      console.log("cartOrderId:", cartOrderId );
      const data = await placeOrder(order, 1);
      if (data?.[0]) setCartOrderId(data[0].orderId);
    } catch (err: any) {
      showNotification.error('Failed to add to cart.');
      console.error(err);
    }
  };

  const clearCartApiCall = async () => {
    try {
      await clearCartApi();
      setLoading(false);
    } catch (err: any) {
      showNotification.error('Failed to clear cart.');
      console.error(err);
    }
  };

  const totalItems = useMemo(
    () => Object.values(quantities).reduce((acc, qty) => acc + qty, 0),
    [quantities]
  );

  return (
    <div className="item-selection">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
                <button onClick={handleClearCart}>Clear Cart</button>
              <button onClick={handleOrderHistory}>Order History</button>
              </div>
              <LogoutButton setIsAuthenticated={setIsAuthenticated} />
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
              const activeOfferItems =
                item.offers?.filter((offer) => isOfferActiveFn(offer)) ?? [];

              const bestOffer = getBestOffer(item);
              const discountedPrice = getDiscountedPrice(item, bestOffer);

              return (
                <div className="item-card" key={item.itemId}>
                  <img
                    src={item.imageUrl}
                    alt={item.itemName || 'Pizza item'}
                  />

                  {activeOfferItems.length > 0 && (
                    <div className="offer-tags">
                      {activeOfferItems.map((offerItem, index) => (
                        <div
                          key={index}
                          className={
                            offerItem.discountType === 'FLAT'
                              ? 'offer-tag-top'
                              : offerItem.discountType === 'PERCENTAGE'
                              ? 'offer-tag green-tag'
                              : ' offer-ribbon'
                          }
                        >
                          {offerItem.offerText}
                        </div>
                      ))}
                    </div>
                  )}

                  <h3>{item.itemName}</h3>
                  <p>
                    ₹{discountedPrice.toFixed(2)}
                    {bestOffer && bestOffer.discountType !== 'BOGO' && (
                      <span className="original-price">₹{item.itemPrice.toFixed(2)}</span>
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
                    <button onClick={() => handleAddToCart(item)}>
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ItemMenu;
