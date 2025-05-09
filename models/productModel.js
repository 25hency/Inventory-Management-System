import mongoose from 'mongoose';

//for create table into db
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        stock: { type: Number, required: true },
        createdBy: { type: String }
    },
    {
        //for date
        timestamps: true,
    },
);

const Product = mongoose.model('Product', productSchema);
export default Product;
