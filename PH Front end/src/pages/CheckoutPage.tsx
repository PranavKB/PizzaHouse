import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/checkOut.scss';
import { confirmOrderCall } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

import { LogoutButton } from './LogoutButton';
import LoadingModal from '../components/LoadingModal/LoadingModal';
import { useItemsContext } from '../context/ItemsContext';


const CheckoutPage: React.FC = () => {
  const { cart, isOfferActiveFn, applyAllActiveOffers, cartOrderId, clearCart } = useCart();
  const navigate = useNavigate();
  const { setLoading } = useItemsContext();

  const { totalPrice, totalDiscount } = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        const { totalAfterDiscount, totalDiscount } = applyAllActiveOffers(item);
        acc.totalPrice += totalAfterDiscount;
        acc.totalDiscount += totalDiscount;
        return acc;
      },
      { totalPrice: 0, totalDiscount: 0 }
    );
  }, [cart]);

  const confirmOrder = async () => {
    if (cartOrderId > 0) {
      setLoading(true);
      await confirmOrderCall(cartOrderId);
      clearCart(); // Clear cart from context
      setLoading(false);        
      navigate('/menu');
    }
  };

  const goBackToMenu = () => {
    navigate('/menu');
  };

  return (
    <div className="checkout-container">
      <div className="sticky-header">
        <div className="header-left">
          <button className="back-button" onClick={goBackToMenu}>
            Back to Menu
          </button>
        </div>
        <h1>Checkout</h1>
        <div className="header-right">
          <LogoutButton  /> 
        </div>
      </div>
      <LoadingModal show={false} message='Loading...' />
      {cart.length === 0 ? (
        <p className="empty-message">Your cart is empty.</p>
      ) : (
        <div>
          <ul className="cart-list">
            {cart.map((item) => {
              const { totalAfterDiscount, totalDiscount } = applyAllActiveOffers(item);
              const quantity = item.quantity;
              const itemPrice = item.itemPrice;
              const originalTotal = itemPrice * quantity;
              const isDiscounted = totalDiscount > 0;

              const activeOffers = (item.offers || []).filter(isOfferActiveFn);
              const displayNote = activeOffers.map((offer) => offer.offerText).join(', ');

              return (
                <li key={item.itemId}>
                  <span className="item-name">{item.itemName}</span>
                  <span className="item-details">
                    ₹
                    {isDiscounted ? (
                      <>
                        <span className="original">
                          <s>{itemPrice}</s>
                        </span>{' '}
                        x {quantity} = ₹{originalTotal.toFixed(2)}
                        <br />
                        <span className="discounted">
                          Total after discount: ₹{totalAfterDiscount.toFixed(2)}
                        </span>
                        <br />
                        <em>Offers applied: {displayNote}</em>
                      </>
                    ) : (
                      <>
                        {itemPrice} x {quantity} = ₹
                        {originalTotal.toFixed(2)}
                      </>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="total">Total: ₹ {totalPrice.toFixed(2)}</div>
          {totalDiscount > 0 && (
            <div className="discount">Discount Given: ₹ {totalDiscount.toFixed(2)}</div>
          )}

          <button className="confirm-button" onClick={confirmOrder}>
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
