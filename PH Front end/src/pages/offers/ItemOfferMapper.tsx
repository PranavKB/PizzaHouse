import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { Item, MenuProps, OfferDTO } from '../../types/interfaces';
import { getItemsDTO } from '../../services/itemService';
import { getOffersDTO } from '../../services/offerService';
import { Form, Select, Button, Checkbox, Card, Typography, Row, Col, message, Spin, Alert } from 'antd';
import { SaveOutlined, SwapOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ItemOfferMapper: React.FC<MenuProps> = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [offers, setOffers] = useState<OfferDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getItemsDTO();
      setItems(data);
      const offerData = await getOffersDTO();
      setOffers(offerData);
    } catch (error) {
      console.error(error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();
  }, []);


  const handleSubmit = async (values: any) => {
    const { itemId, offerIds } = values;

    if (!itemId || !offerIds || offerIds.length === 0) {
      message.error("Select item and at least one offer.");
      return;
    }

    try {
      await axios.post('/http://localhost:8080/api/item-offers', {
        itemId: itemId,
        offerIds: offerIds
      });
      message.success("Mapping saved successfully!");
      form.resetFields(['offerIds']);
    } catch (error) {
      console.error(error);
      message.error("Failed to save mapping.");
    }
  };

  if (!items.length && loading) return <Spin fullscreen />

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <SwapOutlined style={{ marginRight: 10, color: '#fa8c16' }} />
          Item Offer Mapper
        </Title>
      </div>

      <Card
        title="Create New Mapping"
        headStyle={{ color: '#d46b08' }}
        bordered={false}
      >
        <Alert
          message="Info"
          description="Select a pizza item and associate active offers with it. Changes will be reflected in the menu immediately."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            label="Select Item"
            name="itemId"
            rules={[{ required: true, message: 'Please select an item!' }]}
          >
            <Select
              showSearch
              placeholder="Search to select a pizza..."
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {items.map(item => (
                <Option key={item.itemId} value={item.itemId}>
                  {item.itemName} <span style={{ color: '#999', fontSize: '0.8em' }}>({item.itemTypeName})</span>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Select Offers"
            name="offerIds"
            rules={[{ required: true, message: 'Please select at least one offer!' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                {offers.map(offer => (
                  <Col span={24} md={12} key={offer.id}>
                    <Card
                      size="small"
                      hoverable
                      className="offer-checkbox-card"
                      style={{ border: '1px solid #f0f0f0' }}
                    >
                      <Checkbox value={offer.id} style={{ width: '100%' }}>
                        <Text strong>{offer.offerText}</Text>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary" style={{ fontSize: '0.85em' }}>
                            {offer.discountType} • {offer.discountValue}
                          </Text>
                        </div>
                      </Checkbox>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>
              Save Mapping
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ItemOfferMapper;
