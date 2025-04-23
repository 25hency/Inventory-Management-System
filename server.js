import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import billsRouter from './routes/billsRoutes.js';
import customerRouter from './routes/customersRoutes.js';
import productRouter from './routes/productsRoutes.js';
import userRouter from './routes/userRoutes.js';
import analyticsRouter from './routes/analyticsRoutes.js';

dotenv.config();

mongoose.set('strictQuery', true);

//Connect with MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Successfully');
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });

const app = express();

//middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

//routes
app.use('/api/products/', productRouter);
app.use('/api/users/', userRouter);
app.use('/api/bills/', billsRouter);
app.use('/api/customers/', customerRouter);
app.use('/api/analytics/', analyticsRouter);

// One-time database cleanup endpoint - REMOVE IN PRODUCTION
app.post('/api/cleanup/all', async (req, res) => {
    try {
        // Remove all data from all collections
        await Promise.all([
            mongoose.connection.collection('users').deleteMany({}),
            mongoose.connection.collection('products').deleteMany({}),
            mongoose.connection.collection('bills').deleteMany({}),
            mongoose.connection.collection('customers').deleteMany({})
        ]);
        
        res.status(200).json({ message: 'All data has been cleared from the database' });
    } catch (error) {
        console.error('Database cleanup error:', error);
        res.status(500).json({ message: 'Error cleaning database', error: error.message });
    }
});

//Create Port
const PORT = process.env.PORT || 5000;

//Listen
app.listen(PORT, () => {
    console.log(`Serve at running on the port: http://localhost:${PORT}`);
});