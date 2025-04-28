import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Form, Input, Modal, Row, Select, Statistic, Table, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LayoutApp from '../../components/Layout';
import './products.css';

const Products = () => {
    const dispatch = useDispatch();
    const [productData, setProductData] = useState([]);
    const [popModal, setPopModal] = useState(false);
    const [editProduct, setEditProduct] = useState(false);
    const [userId, setUserId] = useState(() => {
        const auth = localStorage.getItem('auth');
        return auth ? JSON.parse(auth)._id : null;
    });
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            setUserId(JSON.parse(auth)._id);
        }
    }, []);

    const [analytics, setAnalytics] = useState({
        lowStockItems: [],
        inventoryStats: { totalProducts: 0, totalStock: 0, totalValue: 0 },
        topSellingProducts: [],
        stockByCategory: []
    });

    const getAllProducts = async () => {
        try {
            dispatch({
                type: 'SHOW_LOADING',
            });
            const { data } = await axios.get('/api/products/getproducts');
            setProductData(data);
            dispatch({
                type: 'HIDE_LOADING',
            });
        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING',
            });
            console.log(error);
        }
    };

    const getAnalytics = async () => {
        try {
            const { data } = await axios.get('/api/analytics/inventory-analytics');
            setAnalytics(data);
        } catch (error) {
            console.log('Analytics Error:', error);
        }
    };

    useEffect(() => {
        getAllProducts();
        getAnalytics();
    }, []);

    const handlerDelete = async record => {
        try {
            dispatch({
                type: 'SHOW_LOADING',
            });
            await axios.post('/api/products/deleteproducts', { productId: record._id });
            message.success('Product Deleted Successfully!');
            getAllProducts();
            setPopModal(false);
            dispatch({
                type: 'HIDE_LOADING',
            });
        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING',
            });
            message.error('Error!');
            console.log(error);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image, record) => <img src={image} alt={record.name} height={60} width={60} />,
            responsive: ['md'],
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: price => <span>₹{price}</span>,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            render: stock => <div>{stock < 10 ? <span style={{ color: 'red' }}>{stock}</span> : <span style={{ color: 'green' }}>{stock}</span>}</div>,
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            render: (_, record) => (
                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            dispatch({
                                type: 'ADD_TO_CART',
                                payload: { ...record, quantity: 1 },
                            });
                            message.success('Added to cart');
                        }}
                        style={{ marginRight: '10px' }}
                        size={isMobile ? "small" : "middle"}
                    >
                        {!isMobile ? 'Add to Cart' : 'Add'}
                    </Button>
                    <EditOutlined
                        className="cart-edit"
                        onClick={() => {
                            setEditProduct(record);
                            setPopModal(true);
                        }}
                    />
                    <DeleteOutlined className="cart-action" onClick={() => handlerDelete(record)} />
                </div>
            ),
        },
    ];

    const handlerSubmit = async value => {
        if (!editProduct) {
            try {
                dispatch({
                    type: 'SHOW_LOADING',
                });
                await axios.post('/api/products/addproducts', { ...value, createdBy: userId });
                message.success('Product Added Successfully!');
                getAllProducts();
                setPopModal(false);
                dispatch({
                    type: 'HIDE_LOADING',
                });
            } catch (error) {
                dispatch({
                    type: 'HIDE_LOADING',
                });
                message.error('Error!');
                console.log(error);
            }
        } else {
            try {
                dispatch({
                    type: 'SHOW_LOADING',
                });
                await axios.put('/api/products/updateproducts', { ...value, productId: editProduct._id });
                message.success('Product Updated Successfully!');
                getAllProducts();
                setPopModal(false);
                dispatch({
                    type: 'HIDE_LOADING',
                });
            } catch (error) {
                dispatch({
                    type: 'HIDE_LOADING',
                });
                message.error('Error!');
                console.log(error);
            }
        }
    };

    return (
        <LayoutApp>
            <div className="analytics-section mb-4">
                <Row gutter={[16, 16]} className="mt-4">
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Products"
                                value={analytics.inventoryStats.totalProducts}
                                prefix="📦"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Stock"
                                value={analytics.inventoryStats.totalStock}
                                prefix="🏭"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Inventory Value"
                                value={analytics.inventoryStats.totalValue}
                                prefix="₹"
                                precision={2}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mt-4">
                    <Col xs={24} md={12}>
                        <Card title="Low Stock Alerts">
                            {analytics.lowStockItems.length > 0 ? (
                                <Table
                                    dataSource={analytics.lowStockItems}
                                    columns={[
                                        { title: 'Name', dataIndex: 'name' },
                                        { 
                                            title: 'Stock', 
                                            dataIndex: 'stock',
                                            render: stock => (
                                                <span style={{ color: stock < 5 ? 'red' : 'orange' }}>{stock}</span>
                                            )
                                        }
                                    ]}
                                    pagination={false}
                                    size="small"
                                    scroll={isMobile ? { x: '100%' } : undefined}
                                />
                            ) : (
                                <Alert message="No low stock items" type="success" showIcon />
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Top Selling Products">
                            <Table
                                dataSource={analytics.topSellingProducts}
                                columns={[
                                    { title: 'Product', dataIndex: 'productName' },
                                    { title: 'Total Sold', dataIndex: 'totalQuantity' }
                                ]}
                                pagination={false}
                                size="small"
                                scroll={isMobile ? { x: '100%' } : undefined}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4" style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '10px' : '0' }}>
                <h2>All Products</h2>
                <Button
                    className="add-new"
                    onClick={() => {
                        setEditProduct(null);
                        setPopModal(true);
                    }}
                >
                    Add Product
                </Button>
            </div>

            <Table
                dataSource={productData}
                columns={columns}
                bordered
                pagination={{ pageSize: isMobile ? 5 : 10 }}
                locale={{
                    emptyText: 'No products available',
                }}
                scroll={isMobile ? { x: '100%' } : undefined}
                size={isMobile ? "small" : "middle"}
            />

            {popModal && (
                <Modal
                    title={`${editProduct !== null ? 'Edit Product' : 'Add New Product'}`}
                    visible={popModal}
                    onCancel={() => {
                        setEditProduct(null);
                        setPopModal(false);
                    }}
                    footer={false}
                >
                    <Form layout="vertical" initialValues={editProduct} onFinish={handlerSubmit}>
                        <FormItem name="name" label="Name">
                            <Input />
                        </FormItem>
                        <FormItem name="category" label="Category">
                            <Input />
                        </FormItem>
                        <FormItem name="price" label="Price">
                            <Input />
                        </FormItem>
                        <FormItem name="stock" label="Stock">
                            <Input />
                        </FormItem>
                        <FormItem name="image" label="Image URL">
                            <Input />
                        </FormItem>
                        <div className="form-btn-add">
                            <Button htmlType="submit" className="add-new">
                                {editProduct ? 'Save' : 'Add'}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            )}
        </LayoutApp>
    );
};

export default Products;
