import { useEffect, useState } from "react";
import type { MenuProps, OfferDTO } from "../../types/interfaces";
// import '../../styles/header.scss'; // Removing custom styles
// import '../../styles/table.scss';
// import '../../styles/modal.scss';
import { convertToUIDateTime, deleteOffer, getOffersDTO, getItemOfferIdMap, mapItemToOffers } from "../../services/offerService";
import showNotification from "../../components/Notification/showNotification";
// import { useConfirm } from "../../components/ConfirmBox/useConfirm"; // Replacing with AntD Popconfirm
import { useItemsContext } from "../../context/ItemsContext";
import { Table, Button, Space, Tag, Typography, Popconfirm, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined, LinkOutlined, TableOutlined, UsergroupAddOutlined } from '@ant-design/icons';

// Modals
import AddOffer from './AddOffer';
import ItemOfferTableModal from './ItemOfferTableModal';
import MapItemOfferModal from '../admin/MapItemOfferModal';
import UserTypesTableModal from '../admin/UserTypesTableModal';

const { Title } = Typography;

const Offers: React.FC<MenuProps> = () => {

  const [offers, setOffers] = useState<OfferDTO[]>([]);
  const [itemOfferMap, setItemOfferMap] = useState<Record<number, number[]>>({});
  // const { confirm, ConfirmModal } = useConfirm(); // Using AntD Popconfirm instead
  const { setLoading } = useItemsContext();

  // Modal States (migrated from Header.tsx)
  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
  const [isMapOfferOpen, setIsMapOfferOpen] = useState(false);
  const [isItemOfferOpen, setIsItemOfferOpen] = useState(false);
  const [isUserTypesOpen, setIsUserTypesOpen] = useState(false);

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
  const fetchItemOfferMap = async () => {
    try {
      const response = await getItemOfferIdMap();
      setItemOfferMap(response);
    } catch (err: any) {
      showNotification.error('Failed to load item-offer map.');
      console.error(err);
    }
  };

  useEffect(() => {

    fetchOffers();
    fetchItemOfferMap();
  }, []);

  const handleDeleteOffer = async (id: number) => {
    // AntD Popconfirm handles the confirmation UI
    await deleteOffer(id);
    setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
    showNotification.success("Offer deleted successfully");
  };


  const handleSaveMapItems = async (itemId: number, offerIds: number[]) => {
    await mapItemToOffers(itemId, offerIds);
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'offerText',
      key: 'offerText',
    },
    {
      title: 'Discount Type',
      dataIndex: 'discountType',
      key: 'discountType',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: 'Discount Value',
      dataIndex: 'discountValue',
      key: 'discountValue',
    },
    {
      title: 'Validity',
      key: 'validity',
      render: (_: any, record: OfferDTO) => (
        <div style={{ fontSize: '0.85em', color: '#666' }}>
          <div>From: {convertToUIDateTime(record.validFrom)}</div>
          <div>To: {convertToUIDateTime(record.validTo)}</div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'gray'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: OfferDTO) => {
        const canDelete = record.validTo && new Date(record.validTo) > new Date();
        // Logic from original code seems to check if validTo is in future? 
        // Wait, original code: offer.validTo && new Date(offer.validTo) > new Date() && ( delete )
        // Usually you delete future or current offers. Expired offers might be history?
        // keeping logic same.

        if (canDelete) {
          return (
            <Popconfirm
              title="Delete Offer"
              description="Are you sure to delete this offer?"
              onConfirm={() => handleDeleteOffer(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
            </Popconfirm>
          );
        }
        return null;
      }
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Offers</Title>
        <Space wrap>
          <Button onClick={() => setIsUserTypesOpen(true)} icon={<UsergroupAddOutlined />}>User Types</Button>
          <Button onClick={() => setIsMapOfferOpen(true)} icon={<LinkOutlined />}>Map Offer</Button>
          <Button onClick={() => setIsItemOfferOpen(true)} icon={<TableOutlined />}>Item Offer Table</Button>
          <Button type="primary" onClick={() => setIsAddOfferOpen(true)} icon={<PlusOutlined />}>Add Offer</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={offers}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          position: ['bottomRight'],
          showTotal: (total) => `Total ${total} offers`
        }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
        bordered
        size="middle"
      />

      {/* Modals from Header/Old code */}
      <Modal
        open={isAddOfferOpen}
        onCancel={() => setIsAddOfferOpen(false)}
        footer={null}
        width={650}
        destroyOnClose
      >
        <AddOffer onClose={() => setIsAddOfferOpen(false)} setOffers={setOffers} />
      </Modal>

      <UserTypesTableModal
        isOpen={isUserTypesOpen}
        onClose={() => setIsUserTypesOpen(false)}
      />
      <MapItemOfferModal
        isOpen={isMapOfferOpen}
        onClose={() => setIsMapOfferOpen(false)}
        offers={offers}
        onSave={handleSaveMapItems}
      />
      <ItemOfferTableModal
        isOpen={isItemOfferOpen}
        onClose={() => setIsItemOfferOpen(false)}
        offers={offers}
        itemOfferMap={itemOfferMap}
      />

    </div>
  );
}

export default Offers;