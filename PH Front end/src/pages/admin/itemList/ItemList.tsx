import React, { useEffect, useState } from 'react';
// import '../../../styles/admin/itemList.scss'; // Removing custom styles
import type { ItemDTO, MenuProps, OfferDTO } from '../../../types/interfaces';
import showNotification from '../../../components/Notification/showNotification';
import { useNavigate } from 'react-router-dom';
// import { LogoutButton } from '../../LogoutButton'; // Removed
import MapItemOfferModal from '../MapItemOfferModal';
import { getOffersDTO, mapItemToOffers } from '../../../services/offerService';
import AddNewItem from './AddNewItem';
import { useItemsContext } from '../../../context/ItemsContext';
import { Table, Button, Space, Tag, Modal, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ItemList: React.FC<MenuProps> = () => {
  const [offers, setOffers] = useState<OfferDTO[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemDTO | null>(null);

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isMapOfferOpen, setIsMapOfferOpen] = useState(false);
  const navigate = useNavigate();
  const { items, setItems, setLoading } = useItemsContext();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await getOffersDTO();
        setOffers(response);
      } catch (err: any) {
        showNotification.error('Failed to load offers.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleOnSelectItem = (item: ItemDTO) => {
    setSelectedItem(item);
    setIsMapOfferOpen(true);
  };

  const redirectToOffers = () => {
    navigate('/offers');
  };

  const handleOfferMapping = (item: ItemDTO) => {
    var res = '';
    if (item.offers?.length > 0) {
      for (const offer of item.offers) {
        res = res + offer.offerText + ', ';
      }
    }
    return res === '' ? 'No offers' : res;
  };

  const handleSaveMapItems = async (itemId: number, offerIds: number[]) => {
    await mapItemToOffers(itemId, offerIds);
    const updatedItems = items.map(item => {
      if (item.itemId === itemId) {
        return {
          ...item,
          offers: offers.filter(offer => offerIds.includes(offer.id))
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const columns: ColumnsType<ItemDTO> = [
    {
      title: '#',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
      width: 50,
    },
    {
      title: 'Name',
      dataIndex: 'itemName',
      key: 'itemName',
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'itemPrice',
      key: 'itemPrice',
      render: (price: number) => `₹${price}`,
      sorter: (a, b) => a.itemPrice - b.itemPrice,
    },
    {
      title: 'Type',
      dataIndex: 'itemTypeName',
      key: 'itemTypeName',
    },
    {
      title: 'Veg/Non-Veg',
      dataIndex: 'isVeg',
      key: 'isVeg',
      render: (isVeg: boolean) => (
        <Tag color={isVeg ? 'green' : 'red'}>
          {isVeg ? 'Veg' : 'Non-Veg'}
        </Tag>
      ),
    },
    {
      title: 'Offers',
      key: 'offers',
      render: (_, record) => (
        <Button type="link" onClick={() => handleOnSelectItem(record)}>
          {handleOfferMapping(record)}
        </Button>
      ),
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Item List</Title>
        <Space>
          <Button onClick={redirectToOffers}>Manage Offers</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddItemOpen(true)}>Add Item</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="itemId"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          position: ['bottomRight']
        }}
        bordered
        size="middle"
        scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
      />

      <MapItemOfferModal
        isOpen={isMapOfferOpen}
        onClose={() => setIsMapOfferOpen(false)}
        offers={offers}
        onSave={handleSaveMapItems}
        initialItemId={selectedItem?.itemId || 0}
        initialOfferIds={selectedItem?.offers?.map(offer => offer.id) || []}
      />

      <Modal
        open={isAddItemOpen}
        onCancel={() => setIsAddItemOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <AddNewItem onClose={() => setIsAddItemOpen(false)} setItems={setItems} />
      </Modal>
    </div>
  );
}

export default ItemList;
