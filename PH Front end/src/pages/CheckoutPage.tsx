import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
// import '../styles/checkOut.scss'; // Removing custom styles
import { confirmOrderCall } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
// import { LogoutButton } from './LogoutButton'; // Removed
// import LoadingModal from '../components/LoadingModal/LoadingModal'; // Replacing with AntD Spin
import { useItemsContext } from '../context/ItemsContext';
import { Table, Button, Card, Typography, Row, Col, Divider, Alert, Spin } from 'antd';
import { LeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
  const { cart, isOfferActiveFn, applyAllActiveOffers, cartOrderId, clearCart } = useCart();
  const navigate = useNavigate();
  const { setLoading, loading } = useItemsContext(); // Assuming loading state is available in context

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
      try {
        await confirmOrderCall(cartOrderId);
        clearCart(); // Clear cart from context
        navigate('/menu');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    } else {
      // Fallback if no order ID (maybe items added but not saved to backend?)
      // In real app we might need to place order first if not saved.
      // For now, assuming cartOrderId exists if flow is correct.
    }
  };

  const goBackToMenu = () => {
    navigate('/menu');
  };

  // Prepare table data
  const data = cart.map(item => {
    const { totalAfterDiscount, totalDiscount } = applyAllActiveOffers(item);
    const activeOffers = (item.offers || []).filter(isOfferActiveFn);

    return {
      ...item,
      totalAfterDiscount,
      totalDiscount, // For this item (total discount for the quantity)
      activeOffersDisplay: activeOffers.map(o => o.offerText).join(', ')
    };
  });

  const columns: ColumnsType<typeof data[0]> = [
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          {record.activeOffersDisplay && (
            <div style={{ fontSize: '0.8rem', color: '#52c41a' }}>Offer: {record.activeOffersDisplay}</div>
          )}
        </div>
      )
    },
    {
      title: 'Price',
      dataIndex: 'itemPrice',
      key: 'itemPrice',
      render: (price) => `₹${price}`,
      align: 'right'
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: 'Total',
      key: 'total',
      align: 'right',
      render: (_, record) => {
        const originalTotal = record.itemPrice * record.quantity;

        if (record.totalDiscount > 0) {
          return (
            <div>
              <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em' }}>
                ₹{originalTotal.toFixed(2)}
              </div>
              <div style={{ color: 'black', fontWeight: 600 }}>
                ₹{record.totalAfterDiscount.toFixed(2)}
              </div>
              <div style={{ color: '#52c41a', fontSize: '0.8em' }}>
                (-₹{record.totalDiscount.toFixed(2)})
              </div>
            </div>
          )
        }
        return `₹${originalTotal.toFixed(2)}`;
      }
    }
  ];

  if (loading) return <Spin size="large" fullscreen />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Button icon={<LeftOutlined />} onClick={goBackToMenu} style={{ marginBottom: 16 }}>Back to Menu</Button>
      <Card title={<Title level={3} style={{ margin: 0 }}>Checkout</Title>}>

        {cart.length === 0 ? (
          <Alert message="Your cart is empty" type="info" showIcon />
        ) : (
          <>
            <Table
              dataSource={data}
              columns={columns}
              pagination={false}
              rowKey="itemId"
              footer={() => (
                <Row gutter={16} justify="end">
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Text type="secondary">Total Discount:</Text>
                    <div><Title level={4}>Total Payable:</Title></div>
                  </Col>
                  <Col span={6} style={{ textAlign: 'right' }}>
                    <Text type="success">- ₹{totalDiscount.toFixed(2)}</Text>
                    <div><Title level={4}>₹{totalPrice.toFixed(2)}</Title></div>
                  </Col>
                </Row>
              )}
            />

            <Divider />

            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={confirmOrder}
              >
                Confirm Order
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CheckoutPage;
