import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PrevOrders.scss';
import { getOrderHistory } from '../services/orderService';

interface OrderItem {
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
  subTotal: number;
  offers?: Offer[];
}

interface Offer {
  discountType: 'FLAT' | 'PERCENTAGE' | 'BOGO';
  discountValue?: number;
  offerText: string;
}

interface Order {
  orderId: number;
  orderTimeStamp: string;
  orderItems: OrderItem[];
  orderTotal: number;
  orderStatusName: 
  | 'In Cart' 
  | 'Payment Pending' 
  | 'Payment Recieved' 
  | 'Order Accepted' 
  | 'Order Preparing' 
  | 'Order Dispatched' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';
  paymentId: number;
  customerName: string;
  orderAddress: string;
  orderEmailId: string;
  orderMobileNo: string;
  orderPinCode: string;
}

const PrevOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrderHistory();
      setOrders(response);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['orderStatusName']) => {
    switch (status) {
        case 'In Cart': 
        return 'status-in-cart';

        case 'Payment Pending': 
        return 'status-payment-pending';

        case 'Payment Recieved': 
        return 'status-payment-received';

        case 'Order Accepted': 
        return 'status-order-accepted';

        case 'Order Preparing': 
        return 'status-order-preparing';

        case 'Order Dispatched': 
        return 'status-order-dispatched';

        case 'Out for Delivery': 
        return 'status-delivery';

        case 'Delivered': 
        return 'status-delivered';

        case 'Cancelled': 
        return 'status-cancelled';

        default: 
        return '';
    }
    };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotals = (items: OrderItem[]) => {
    let subtotal = 0;
    let discount = 0;

    for (const item of items) {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      if (item.offers && item.offers.length > 0) {
        for (const offer of item.offers) {
          if (offer.discountType === 'FLAT') {
            discount += offer.discountValue ?? 0;
          } else if (offer.discountType === 'PERCENTAGE') {
            discount += itemTotal * ((offer.discountValue ?? 0) / 100);
          } else if (offer.discountType === 'BOGO') {
            const bogoItems = Math.floor(item.quantity / 2);
            discount += bogoItems * item.price;
          }
        }
      }
    }

    const total = subtotal - discount;
    return { subtotal, discount, total };
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const redirectToMenu = () => {
    navigate('/menu');
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <div className="prev-orders-container">
      <h1>Order History</h1>
      {orders?.length != 0 ? (
        <div className="header-bar">
          <div className="header-info">
              <button onClick={redirectToMenu}>Menu</button>
          </div>
      </div>
      ): <> </>}

      {orders?.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/')}>Browse Menu</button>
        </div>
      ) : (
        <div className="orders-content">
          <div className="orders-list">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    onClick={() => handleOrderClick(order)}
                    className={selectedOrder?.orderId === order.orderId ? 'selected' : ''}
                  >
                    <td>#{order.orderId}</td>
                    <td>{formatDate(order.orderTimeStamp)}</td>
                    <td>{order.orderItems.length} items</td>
                    <td>₹{calculateTotals(order.orderItems).total.toFixed(2)}</td>
                    <td>
                      <span className={`status ${getStatusColor(order.orderStatusName)}`}>
                        {order.orderStatusName.replace(/-/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div className="order-details">
              <div className="order-header">
                <button 
                  className="close-button" 
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
                <h2>Order Details #{selectedOrder?.orderId}</h2>
                
              </div>
              <div className="order-info">
                <p><strong>Date:</strong> {formatDate(selectedOrder?.orderTimeStamp)}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status ${getStatusColor(selectedOrder?.orderStatusName)}`}>
                    {selectedOrder?.orderStatusName.replace(/-/g, ' ')}
                  </span>
                </p>
                <p><strong>Payment ID:</strong> {selectedOrder?.paymentId === 0 ? 'Not Paid' : selectedOrder?.paymentId}</p>
                <p><strong>Customer:</strong> {selectedOrder?.customerName}</p>
                <p><strong>Mobile:</strong> {selectedOrder?.orderMobileNo}</p>
                <p><strong>Email:</strong> {selectedOrder?.orderEmailId}</p>
                <p><strong>Address:</strong> {selectedOrder?.orderAddress}</p>
                <p><strong>Pin Code:</strong> {selectedOrder?.orderPinCode}</p>
              </div>

              <div className="items-list">
                <h3>Items</h3>
                <ul>
                  {selectedOrder.orderItems.map((item, index) => (
                    <li key={index}>
                      <span className="item-name">{item.itemName}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      {item.offers && item.offers.length > 0 && (
                        <span className="offer-text">
                          {item.offers.map(offer => offer.offerText).join(', ')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-summary">
                {(() => {
                  const { subtotal, discount, total } = calculateTotals(selectedOrder.orderItems);
                  return (
                    <>
                      <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="summary-row discount">
                          <span>Discount:</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="summary-row total">
                        <span>Total:</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrevOrders;
