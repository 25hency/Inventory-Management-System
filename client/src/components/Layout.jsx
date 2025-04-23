import {
    LogoutOutlined,
    MoneyCollectOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import brandLogo from '../asset/images/brand-logo.png';
import './layout.css';
import Spinner from './Spinner';

const { Header, Sider, Content } = Layout;

const LayoutApp = ({ children }) => {
    const { cartItems, loading } = useSelector(state => state.rootReducer);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <Layout>
            {loading && <Spinner />}
            <Sider>
                <div className="logo">
                    <img src={brandLogo} alt="brand-logo" className="brand-logo" />
                    <h4 className="logo-title">Inventory Management</h4>
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
                    <div className="cart-items" onClick={() => navigate('/cart')}>
                        <ShoppingCartOutlined />
                        <span className="cart-badge">{cartItems.length}</span>
                    </div>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
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
