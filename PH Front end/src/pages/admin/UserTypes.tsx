import { useEffect, useState } from "react";
import showNotification from "../../components/Notification/showNotification";
import { getUserTypes } from "../../services/itemService";
import type { MenuProps, UserType } from "../../types/interfaces";
import { useItemsContext } from "../../context/ItemsContext";
import { Table, Typography, Card, Tag } from "antd";
import { UsergroupAddOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserTypes: React.FC<MenuProps> = () => {
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const { setLoading, loading } = useItemsContext();

  useEffect(() => {
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
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: UserType, b: UserType) => a.name.localeCompare(b.name),
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <Tag>{id}</Tag>
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <UsergroupAddOutlined style={{ marginRight: 10, color: '#fa8c16' }} />
          User Types
        </Title>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table
          columns={columns}
          dataSource={userTypes}
          rowKey="id"
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            position: ['bottomRight']
          }}
          loading={loading}
          bordered
          size="middle"
        />
      </Card>
    </div>
  )
}

export default UserTypes