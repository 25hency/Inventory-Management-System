import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Table, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import Layout from '../../components/Layout';

const Bills = () => {
    const componentRef = useRef();
    const dispatch = useDispatch();
    const [billsData, setBillsData] = useState([]);
    const [popModal, setPopModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    const getAllBills = async () => {
        try {
            dispatch({
                type: 'SHOW_LOADING',
            });
            const { data } = await axios.get('/api/bills/getbills');
            setBillsData(data);
            dispatch({
                type: 'HIDE_LOADING',
            });
        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING',
            });
            message.error('Error fetching bills');
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBills();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            ellipsis: true,
            responsive: ['md'],
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
        },
        {
            title: 'Contact Number',
            dataIndex: 'customerPhone',
            render: phone => <span>+91 {phone}</span>,
        },
        {
            title: 'Customer Address',
            dataIndex: 'customerAddress',
            responsive: ['lg'],
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            render: total => <span>₹{total}</span>
        },
        {
            title: 'Action',
            dataIndex: '_id',
            render: (id, record) => (
                <div>
                    <EyeOutlined
                        className="cart-edit eye"
                        onClick={() => {
                            setSelectedBill(record);
                            setPopModal(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <Layout>
            <h2>All Invoice </h2>
            <Table 
                dataSource={billsData} 
                columns={columns} 
                bordered 
                scroll={isMobile ? { x: '100%' } : undefined}
                size={isMobile ? "small" : "middle"}
                pagination={{ pageSize: isMobile ? 5 : 10 }}
            />

            {popModal && (
                <Modal 
                    title="Invoice Details" 
                    width={isMobile ? '95%' : 400} 
                    pagination={false} 
                    visible={popModal} 
                    onCancel={() => setPopModal(false)} 
                    footer={false}
                >
                    <div className="card" ref={componentRef}>
                        <div className="cardHeader">
                            <h2 className="logo">Home System</h2>
                        </div>
                        <div className="cardBody">
                            <div className="group">
                                <span>Customer Name:</span>
                                <span>
                                    <b>{selectedBill.customerName}</b>
                                </span>
                            </div>
                            <div className="group">
                                <span>Customer Phone:</span>
                                <span>
                                    <b>+91 {selectedBill.customerPhone}</b>
                                </span>
                            </div>
                            <div className="group">
                                <span>Customer Address:</span>
                                <span>
                                    <b>{selectedBill.customerAddress}</b>
                                </span>
                            </div>
                            <div className="group">
                                <span>Date Order:</span>
                                <span>
                                    <b>{selectedBill.createdAt.toString().substring(0, 10)}</b>
                                </span>
                            </div>
                            <div className="group">
                                <span>Total Amount:</span>
                                <span>
                                    <b>₹{selectedBill.totalAmount}</b>
                                </span>
                            </div>
                        </div>
                        <div className="cardFooter">
                            <h4>Your Order</h4>
                            {selectedBill.cartItems.map(product => (
                                <>
                                    <div className="footerCard">
                                        <div className="group">
                                            <span>Product:</span>
                                            <span>
                                                <b>{product.name}</b>
                                            </span>
                                        </div>
                                        <div className="group">
                                            <span>Qty:</span>
                                            <span>
                                                <b>{product.quantity}</b>
                                            </span>
                                        </div>
                                        <div className="group">
                                            <span>Price:</span>
                                            <span>
                                                <b>₹{product.price}</b>
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ))}
                            <div className="footerCardTotal">
                                <div className="group">
                                    <h3>Total:</h3>
                                    <h3>
                                        <b>₹{selectedBill.totalAmount}</b>
                                    </h3>
                                </div>
                            </div>
                            <div className="footerThanks">
                                <span>Thank You for buying from us</span>
                            </div>
                        </div>
                    </div>
                    <div className="bills-btn-add">
                        <Button onClick={handlePrint} htmlType="submit" className="add-new">
                            Generate Invoice
                        </Button>
                    </div>
                </Modal>
            )}
        </Layout>
    );
};

export default Bills;
