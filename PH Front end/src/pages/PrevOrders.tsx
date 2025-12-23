import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../styles/PrevOrders.scss'; // Removing custom styles
import { getOrderHistory } from '../services/orderService';
import { useItemsContext } from '../context/ItemsContext';
import { Table, Tag, Drawer, List, Typography, Divider, Descriptions, Button, Empty, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ShoppingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Offer {
  discountType: 'FLAT' | 'PERCENTAGE' | 'BOGO';
  discountValue?: number;
  offerText: string;
}

interface OrderItem {
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
  subTotal: number;
  offers?: Offer[];
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
  const { setLoading, loading } = useItemsContext();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
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
      case 'Delivered': return 'green';
      case 'Cancelled': return 'red';
      case 'Order Accepted':
      case 'Order Preparing':
      case 'Order Dispatched':
      case 'Out for Delivery': return 'processing'; // AntD 'processing' is blue
      case 'Payment Recieved': return 'cyan'; // Cyan for payment
      default: return 'default';
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

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedOrder(null);
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => <Text strong>#{id}</Text>,
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: 'Date',
      dataIndex: 'orderTimeStamp',
      key: 'orderTimeStamp',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.orderTimeStamp).getTime() - new Date(b.orderTimeStamp).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, record) => record.orderItems.length,
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => `₹${calculateTotals(record.orderItems).total.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'orderStatusName',
      key: 'status',
      render: (status: Order['orderStatusName']) => (
        <Tag color={getStatusColor(status)}>
          {status.replace(/-/g, ' ')}
        </Tag>
      ),
      filters: Array.from(new Set(orders.map(o => o.orderStatusName))).map(s => ({ text: s, value: s })),
      onFilter: (value: any, record) => record.orderStatusName === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => showOrderDetails(record)}>
          View Details
        </Button>
      ),
    }
  ];

  if (loading && orders.length === 0) return <Spin size="large" fullscreen />;

  return (
    <div className="prev-orders-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Order History</Title>
        {orders.length === 0 && (
          <Button type="primary" icon={<ShoppingOutlined />} onClick={() => navigate('/menu')}>
            Browse Menu
          </Button>
        )}
      </div>

      {orders.length === 0 ? (
        <Empty description="You haven't placed any orders yet." />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomRight'],
            showTotal: (total) => `Total ${total} orders`
          }}
          bordered
          size="middle"
        />
      )}

      <Drawer
        title={`Order #${selectedOrder?.orderId}`}
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={500}
      >
        {selectedOrder && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Date">{formatDate(selectedOrder.orderTimeStamp)}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.orderStatusName)}>
                  {selectedOrder.orderStatusName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment ID">{selectedOrder.paymentId === 0 ? 'Not Paid' : selectedOrder.paymentId}</Descriptions.Item>
              <Descriptions.Item label="Customer">{selectedOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="Mobile">{selectedOrder.orderMobileNo}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedOrder.orderAddress}, {selectedOrder.orderPinCode}</Descriptions.Item>
            </Descriptions>

            <Divider>Items</Divider>
            <List
              itemLayout="horizontal"
              dataSource={selectedOrder.orderItems}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<span>{item.itemName} <Text type="secondary">x{item.quantity}</Text></span>}
                    description={
                      <>
                        {item.offers && item.offers.map((offer, idx) => (
                          <Tag color="green" key={idx} style={{ marginRight: 4 }}>{offer.offerText}</Tag>
                        ))}
                      </>
                    }
                  />
                  <div>₹{(item.price * item.quantity).toFixed(2)}</div>
                </List.Item>
              )}
            />

            <Divider />

            {(() => {
              const { subtotal, discount, total } = calculateTotals(selectedOrder.orderItems);
              return (
                <div style={{ textAlign: 'right' }}>
                  <Descriptions column={1} size="small" style={{ display: 'inline-block', width: '100%' }}>
                    <Descriptions.Item label="Subtotal">₹{subtotal.toFixed(2)}</Descriptions.Item>
                    {discount > 0 && (
                      <Descriptions.Item label="Discount" contentStyle={{ color: 'green' }}>-₹{discount.toFixed(2)}</Descriptions.Item>
                    )}
                    <Descriptions.Item label={<Text strong>Total</Text>} contentStyle={{ fontWeight: 'bold' }}>₹{total.toFixed(2)}</Descriptions.Item>
                  </Descriptions>
                </div>
              );
            })()}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default PrevOrders;
