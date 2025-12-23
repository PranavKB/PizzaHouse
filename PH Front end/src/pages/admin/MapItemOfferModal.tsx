import React, { useState, useEffect } from 'react';
import type { OfferDTO } from '../../types/interfaces';
import { useItemsContext } from '../../context/ItemsContext';
import { Modal, Select, Table, Checkbox, Tag } from 'antd';
import { convertToUIDateTime } from '../../services/offerService';

const { Option } = Select;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  offers: OfferDTO[];
  onSave: (itemId: number, offerIds: number[]) => void;
  initialItemId?: number;
  initialOfferIds?: number[];
}

const EMPTY_ARRAY: number[] = [];

const MapItemOfferModal: React.FC<Props> = ({
  isOpen,
  onClose,
  offers,
  onSave,
  initialItemId = 0,
  initialOfferIds = EMPTY_ARRAY
}) => {
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(initialItemId);
  const [selectedOfferIds, setSelectedOfferIds] = useState<number[]>(initialOfferIds);
  const { items } = useItemsContext();

  useEffect(() => {
    if (isOpen) {
      setSelectedItemId(initialItemId);
      setSelectedOfferIds(initialOfferIds);
    }
  }, [initialItemId, initialOfferIds, isOpen]);

  const handleOfferChange = (offerId: number, checked: boolean) => {
    setSelectedOfferIds(prev =>
      checked ? [...prev, offerId] : prev.filter(id => id !== offerId)
    );
  };

  const handleManualSave = () => {
    if (selectedItemId) {
      onSave(selectedItemId, selectedOfferIds);
      onClose();
    }
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      width: 50,
      render: (_: any, record: OfferDTO) => (
        <Checkbox
          checked={selectedOfferIds.includes(record.id)}
          onChange={(e) => handleOfferChange(record.id, e.target.checked)}
        />
      )
    },
    {
      title: 'Offer Text',
      dataIndex: 'offerText',
      key: 'offerText'
    },
    {
      title: 'Type',
      dataIndex: 'discountType',
      key: 'discountType',
      render: (type: string) => <Tag>{type}</Tag>
    },
    {
      title: 'Valid From',
      dataIndex: 'validFrom',
      key: 'validFrom',
      render: (date: any) => <span style={{ fontSize: '0.85em' }}>{convertToUIDateTime(date)}</span>
    },
    {
      title: 'Valid To',
      dataIndex: 'validTo',
      key: 'validTo',
      render: (date: any) => <span style={{ fontSize: '0.85em' }}>{convertToUIDateTime(date)}</span>
    },
  ];

  return (
    <Modal
      title="Map Items to Offers"
      open={isOpen}
      onCancel={onClose}
      width={800}
      onOk={handleManualSave}
      okText="Save Mapping"
      okButtonProps={{ disabled: !selectedItemId }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>Select Item:</span>
        <Select
          showSearch
          style={{ width: 300 }}
          placeholder="Select a pizza item"
          optionFilterProp="children"
          value={selectedItemId || undefined} // Antd Select needs undefined for empty
          onChange={(val) => setSelectedItemId(val)}
          filterOption={(input, option) =>
            (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
        >
          {items.map(item => (
            <Option key={item.itemId} value={item.itemId}>
              {item.itemName}
            </Option>
          ))}
        </Select>
      </div>

      <Table
        dataSource={offers}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        size="small"
        scroll={{ y: 300 }}
      />
    </Modal>
  );
};

export default MapItemOfferModal;
