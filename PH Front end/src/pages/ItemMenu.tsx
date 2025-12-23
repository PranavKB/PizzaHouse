import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useItemsContext } from '../context/ItemsContext';
import { useCart, type CartItem } from '../context/CartContext';
// import '../styles/itemMenu.scss'; // Removing custom scss in favor of AntD styles where possible
import { useNavigate } from 'react-router-dom';
import showNotification from '../components/Notification/showNotification';
import Counter from '../components/Counter/Counter';
// import { LogoutButton } from './LogoutButton'; // Removed as it's in MainLayout
import ImageFromBlob from './ImageFromBlob';
import type { ItemDTO, MenuProps } from '../types/interfaces';
import { clearCartApi, getUserCart, placeOrder } from '../services/orderService';
import { Card, Row, Col, Typography, Button, Radio, Tag, Space, Badge, Spin, Alert, theme } from 'antd';
import { ShoppingCartOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { useToken } = theme;

const ItemMenu: React.FC<MenuProps> = () => {
  const { token } = useToken();
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
    if (!loading && (!items || items.length === 0)) {
      refreshItems();
    }
  }, [items.length, refreshItems, loading]);

  useEffect(() => {
    if (!loading && items && items.length > 0) {
      fetchCartFromApi();
    }
  }, [loading, items.length]);

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
    if (cart.length === 0) {
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
      console.log("cartOrderId:", cartOrderId);
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
    return <Spin tip="Loading items..." fullscreen />;
  }

  if (error) {
    return <Alert message="Error" description={`Error loading items: ${error}`} type="error" showIcon />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Select Your Pizza</Title>

        <Space wrap>
          <Radio.Group
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="ALL">All</Radio.Button>
            <Radio.Button value="VEG">Veg</Radio.Button>
            <Radio.Button value="NON_VEG">Non-Veg</Radio.Button>
          </Radio.Group>

          <Button icon={<SaveOutlined />} onClick={saveCartItems}>Save</Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleClearCart}>Clear</Button>
          <Badge count={totalItems} showZero>
            <Button type="primary" icon={<ShoppingCartOutlined />} onClick={handleCheckout}>Checkout</Button>
          </Badge>
        </Space>
      </div>

      <Row gutter={[16, 24]}>
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
              <Col xs={24} sm={12} md={8} lg={6} key={item.itemId}>
                <Card
                  hoverable
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  cover={
                    <div style={{ height: 200, width: '100%', overflow: 'hidden', position: 'relative' }}>
                      {item.imageUrl.startsWith('image/view/') ? (
                        <ImageFromBlob imagePath={item.imageUrl} alt={item.itemName} />
                      ) : item.imageUrl.startsWith('images/') ? (
                        <img
                          alt={item.itemName}
                          src={`src/assets/${item.imageUrl}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <img
                          alt="No Image"
                          src="/images/fallback.jpg"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                      {activeOffers.length > 0 && (
                        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {activeOffers.map((offer, idx) => (
                            <Tag color={offer.discountType === 'PERCENTAGE' ? 'green' : 'red'} key={idx}>
                              {offer.offerText}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  }
                  actions={[
                    visibleCounters.has(item.itemId) ? (
                      <div style={{ padding: '0 16px' }}>
                        {/* Re-using Custom Counter or replace with AntD InputNumber later if needed. Keeping custom for now as it handles + - logic specific way */}
                        <Counter
                          value={quantities[item.itemId] || 0}
                          onIncrement={() => handleIncrement(item)}
                          onDecrement={() => handleDecrement(item)}
                          onReset={() => handleReset(item)}
                        />
                      </div>
                    ) : (
                      <Button type="primary" block onClick={() => handleAddToCartFirst(item)}>
                        Add to Cart
                      </Button>
                    )
                  ]}
                >
                  <Card.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.itemName}</span>
                        <Tag color={item.isVeg ? 'green' : 'red'}>{item.isVeg ? 'Veg' : 'Non-Veg'}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Text strong style={{ fontSize: '1.2rem', color: token.colorPrimary }}>
                          ₹{discountedPrice.toFixed(2)}
                        </Text>
                        {bestOffer && bestOffer.discountType !== 'BOGO' && (
                          <Text delete type="secondary" style={{ marginLeft: 8 }}>
                            ₹{item.itemPrice.toFixed(2)}
                          </Text>
                        )}
                        <div style={{ marginTop: 8 }}>
                          {/* {item.description} */}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default ItemMenu;
