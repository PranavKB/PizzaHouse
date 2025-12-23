import React, { useMemo } from 'react';
import type { OfferDTO } from '../../types/interfaces';
import { useItemsContext } from '../../context/ItemsContext';
import { Modal, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  offers: OfferDTO[];
  itemOfferMap: Record<number, number[]>;
}

const ItemOfferTableModal: React.FC<Props> = ({
  isOpen,
  onClose,
  offers,
  itemOfferMap
}) => {
  const { items } = useItemsContext();

  const offerIdMap: Record<number, OfferDTO> = useMemo(() => Array.isArray(offers)
    ? offers.reduce((map, offer) => {
      map[offer.id] = offer;
      return map;
    }, {} as Record<number, OfferDTO>)
    : {}, [offers]);

  const columns: ColumnsType<any> = [
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
      width: '30%',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Offers',
      key: 'offers',
      render: (_, record) => {
        const mappedOfferIds = itemOfferMap[record.itemId] || [];
        if (mappedOfferIds.length === 0) return <span style={{ color: '#999' }}>No offers</span>;

        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {mappedOfferIds.map(offerId => {
              const offer = offerIdMap[offerId];
              return offer ? (
                <Tag color="cyan" key={offerId}>{offer.offerText}</Tag>
              ) : null;
            })}
          </div>
        )
      }
    }
  ];

  return (
    <Modal
      title="Item Offers Table"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Table
        columns={columns}
        dataSource={items}
        rowKey="itemId"
        pagination={{ pageSize: 5 }}
        size="small"
      />
    </Modal>
  );
};

export default ItemOfferTableModal;
