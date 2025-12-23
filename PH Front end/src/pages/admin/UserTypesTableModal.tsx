import React, { useEffect, useState } from 'react';
import type { UserType } from '../../types/interfaces';
import { getUserTypes } from '../../services/itemService';
import showNotification from '../../components/Notification/showNotification';
import { useItemsContext } from '../../context/ItemsContext';
import { Modal, Table } from 'antd';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UserTypesTableModal: React.FC<Props> = ({
  isOpen,
  onClose
}) => {
  const { setLoading } = useItemsContext();
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUserTypes = async () => {
      try {
        setLoading(true);
        const response = await getUserTypes();
        setUserTypes(response);
      } catch (err: any) {
        showNotification.error('Failed to load user types.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTypes();
  }, [isOpen, setLoading]);

  const columns = [
    {
      title: 'User Type Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    }
  ];

  return (
    <Modal
      title="User Types Table"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Table
        dataSource={userTypes}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        size="small"
      />
    </Modal>
  );
};

export default UserTypesTableModal;
