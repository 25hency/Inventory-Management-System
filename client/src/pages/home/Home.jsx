import { Empty, Row, Col, Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LayoutApp from '../../components/Layout';
import Product from '../../components/Product';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import './home.css';

const Home = () => {
    const dispatch = useDispatch();
    const [productData, setProductData] = useState([]);
    const [analyticsData, setAnalyticsData] = useState({
        categoryDistribution: [],
        topProducts: []
    });
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getAllProducts = async () => {
        try {
            dispatch({ type: 'SHOW_LOADING' });
            const { data } = await axios.get('/api/products/getproducts');
            setProductData(data);
            dispatch({ type: 'HIDE_LOADING' });
        } catch (error) {
            console.log(error);
            dispatch({ type: 'HIDE_LOADING' });
        }
    };

    const fetchAnalyticsData = async () => {
        try {
            const { data } = await axios.get('/api/analytics/inventory-analytics');
            
            const categoryData = data.stockByCategory.map(item => ({
                name: item._id || 'Uncategorized',
                value: item.totalStock
            }));

            const topProductsData = data.topSellingProducts.map(item => ({
                name: item.productName,
                sales: item.totalQuantity
            }));

            setAnalyticsData({
                categoryDistribution: categoryData,
                topProducts: topProductsData
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    useEffect(() => {
        getAllProducts();
        fetchAnalyticsData();
    }, []);

    return (
        <LayoutApp>
            <h2>Product Catalog</h2>
            {productData.length === 0 ? (
                <div className="no-product">
                    <h3 className="no-product-text">No Product Found</h3>
                    <Empty />
                </div>
            ) : (
                <>
                    <div className="products-container">
                        <Row gutter={[16, 16]} style={{ width: '100%' }}>
                            {productData?.map(product => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product._id} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <div className="analytics-section">
                        <h2>Inventory Analytics</h2>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card title="Category Distribution">
                                    <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                                        <PieChart>
                                            <Pie
                                                data={analyticsData.categoryDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={!isMobile}
                                                outerRadius={isMobile ? 60 : 80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={isMobile ? null : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {analyticsData.categoryDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card title="Top Selling Products">
                                    <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                                        <BarChart data={analyticsData.topProducts}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" tick={!isMobile} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="sales">
                                                {analyticsData.topProducts.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </LayoutApp>
    );
};

export default Home;
