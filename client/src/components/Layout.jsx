import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoneyCollectOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import brandLogo from '../asset/images/brand-logo.png';
import './layout.css';
import Spinner from './Spinner';

const { Header, Sider, Content } = Layout;

const LayoutApp = ({ children }) => {
    const { cartItems, loading } = useSelector(state => state.rootReducer);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(window.innerWidth < 576);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 576);
            if (window.innerWidth >= 576) {
                setCollapsed(false);
            } else {
                setCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout>
            {loading && <Spinner />}
            <Sider 
                collapsible 
                collapsed={collapsed} 
                trigger={null}
                collapsedWidth={isMobile ? 0 : 80}
                breakpoint="lg"
                style={isMobile ? { position: 'fixed', height: '100%', zIndex: 999 } : {}}
            >
                <div className="logo">
                    <img src={brandLogo} alt="brand-logo" className="brand-logo" />
                    {!collapsed && <h4 className="logo-title">Inventory Management</h4>}
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={window.location.pathname}>
                    <Menu.Item key="/" icon={<ShoppingOutlined />}>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="/products" icon={<ShopOutlined />}>
                        <Link to="/products">Products</Link>
                    </Menu.Item>
                    <Menu.Item key="/customers" icon={<UserSwitchOutlined />}>
                        <Link to="/customers">Customers</Link>
                    </Menu.Item>
                    <Menu.Item key="/bills" icon={<MoneyCollectOutlined />}>
                        <Link to="/bills">Bills</Link>
                    </Menu.Item>
                    <Menu.Item
                        key="/logout"
                        icon={<LogoutOutlined />}
                        onClick={() => {
                            localStorage.removeItem('auth');
                            navigate('/login');
                        }}
                    >
                        LogOut
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background">
                    {isMobile && (
                        <div className="mobile-menu-button" onClick={toggleSidebar}>
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </div>
                    )}
                    <div className="cart-items" onClick={() => navigate('/cart')}>
                        <ShoppingCartOutlined />
                        <span className="cart-badge">{cartItems.length}</span>
                    </div>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: isMobile ? '12px 8px' : '24px 16px',
                        padding: isMobile ? 12 : 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutApp;
