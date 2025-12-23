import React from 'react';
import { Layout, Menu, Button, Badge, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import {
    LogoutOutlined,
    ShopOutlined,
    UnorderedListOutlined,
    UsergroupAddOutlined,
    TagsOutlined,
    HistoryOutlined,
    ShoppingCartOutlined,
    SwapOutlined,
    BgColorsOutlined,
    BulbOutlined,
    BulbFilled
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const { setColor, setMode, mode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = user?.role === 'Admin';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const colorItems: MenuProps['items'] = [
        { key: 'blue', label: 'Blue', onClick: () => setColor('blue') },
        { key: 'green', label: 'Green', onClick: () => setColor('green') },
        { key: 'orange', label: 'Orange', onClick: () => setColor('orange') },
        { key: 'yellow', label: 'Yellow', onClick: () => setColor('yellow') },
    ];

    const modeItems: MenuProps['items'] = [
        { key: 'light', label: 'Light Mode', icon: <BulbOutlined />, onClick: () => setMode('light') },
        { key: 'dark', label: 'Dark Mode', icon: <BulbFilled />, onClick: () => setMode('dark') },
    ];

    const navItems = isAdmin
        ? [
            {
                key: '/item-list',
                icon: <UnorderedListOutlined />,
                label: 'Items',
                onClick: () => navigate('/item-list'),
            },
            {
                key: '/offers',
                icon: <TagsOutlined />,
                label: 'Offers',
                onClick: () => navigate('/offers'),
            },
            {
                key: '/userTypes',
                icon: <UsergroupAddOutlined />,
                label: 'User Types',
                onClick: () => navigate('/userTypes'),
            },
            {
                key: '/item-offer-mapper',
                icon: <SwapOutlined />,
                label: 'Item Mapper',
                onClick: () => navigate('/item-offer-mapper'),
            },
        ]
        : [
            {
                key: '/menu',
                icon: <ShopOutlined />,
                label: 'Menu',
                onClick: () => navigate('/menu'),
            },
            {
                key: '/order-history',
                icon: <HistoryOutlined />,
                label: 'Order History',
                onClick: () => navigate('/order-history'),
            },
        ];

    // Calculate distinct items count for badge
    const cartCount = cart.length;

    return (
        <Layout>
            <Header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px'
            }}>
                <div className="logo" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem', marginRight: '20px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    PizzaHouse
                </div>

                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={navItems}
                    style={{ flex: 1, minWidth: 0 }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                    <Dropdown menu={{ items: colorItems }} trigger={['click']}>
                        <Button icon={<BgColorsOutlined />} type="text" style={{ color: 'white' }} />
                    </Dropdown>
                    <Dropdown menu={{ items: modeItems }} trigger={['click']}>
                        <Button icon={mode === 'dark' ? <BulbFilled /> : <BulbOutlined />} type="text" style={{ color: 'white' }} />
                    </Dropdown>

                    {!isAdmin && (
                        <Badge count={cartCount} showZero>
                            <Button
                                type="text"
                                icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: 'white' }} />}
                                onClick={() => navigate('/checkout')}
                            />
                        </Badge>
                    )}

                    <span style={{ color: 'white', marginRight: '8px' }}>
                        Hello, {user?.username || 'User'}
                    </span>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </Header>

            <Content style={{
                padding: '6px 12px',
                flex: '1 0 auto',
            }}>
                <div style={{
                    background: mode === 'dark' ? '#141414' : '#fff',
                    padding: 12,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                    {children}
                </div>
            </Content>
            {/* 
            <Footer style={{
                textAlign: 'center',
                background: mode === 'dark' ? '#001529' : '#fff',
                color: mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)',
                borderTop: mode === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
                padding: '16px 50px',
                position: 'fixed',
                bottom: 0,
                zIndex: 1000,
                width: '100%',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <span>PizzaHouse ©2025 | Modern Pizza Ordering Experience</span>
            </Footer> */}
        </Layout>
    );
};

export default MainLayout;
