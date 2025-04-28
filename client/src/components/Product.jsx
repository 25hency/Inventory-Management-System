import React from 'react';
import { Button, Card, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

const Product = ({ product }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.rootReducer);

    const handlerToCart = () => {
        const existingItem = cartItems.find(item => item._id === product._id);
        if (existingItem && existingItem.quantity >= product.stock) {
            message.warning(`Cannot add more than available stock (${product.stock} items)`);
            return;
        }
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, quantity: 1 },
        });
        message.success('Added to cart');
    };

    const { Meta } = Card;

    return (
        <Card 
            hoverable 
            style={{ 
                width: '100%', 
                marginBottom: 20,
                maxWidth: 300
            }} 
            cover={
                <img 
                    alt={product.name} 
                    src={product.image} 
                    style={{ 
                        height: 180, 
                        objectFit: 'cover',
                        width: '100%' 
                    }} 
                />
            }
        >
            <Meta title={product.name} />
            <Meta title={`Price: ₹${product.price}`} />
            <p>Stock: {product?.stock < 10 ? <span style={{ color: 'red' }}>{product.stock}</span> : <span style={{ color: 'green' }}>{product.stock}</span>}</p>
            {product?.stock === 0 && <Meta title={'Status: '} description={`Out of stock`} />}
            <div className="product-btn">
                {product?.stock > 0 && <Button onClick={() => handlerToCart()}>Add To Cart</Button>}
            </div>
        </Card>
    );
};

export default Product;
