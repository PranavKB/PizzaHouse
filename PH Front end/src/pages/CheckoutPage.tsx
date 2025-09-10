import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/checkOut.scss';
import { confirmOrderCall } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { cart, isOfferActiveFn, applyAllActiveOffers, cartOrderId } = useCart();
  const navigate = useNavigate();


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

const confirmOrder = () => {
  if(cartOrderId > 0) {
    confirmOrderCall(cartOrderId);
    navigate('/menu')
  }
};

  return (
      <div className="checkout-container">
      <h1>Checkout</h1>

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

            // List of applied offers (texts only)
            const activeOffers = (item.offers || [])
              .filter(isOfferActiveFn);

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

          <button className="confirm-button" onClick={confirmOrder}>Confirm Order</button>
        </div>
      )}
    </div>

  );
};

export default CheckoutPage;
