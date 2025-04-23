import Product from '../models/productModel.js';
import Bills from '../models/billsModel.js';

export const getInventoryAnalytics = async (req, res) => {
    try {
        // Get low stock items (less than 10 units)
        const lowStockItems = await Product.find({ 
            stock: { $lt: 10 } 
        }).sort({ stock: 1 });

        // Get total products and total stock value
        const inventoryStats = await Product.aggregate([
            { $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalStock: { $sum: "$stock" },
                totalValue: { $sum: { $multiply: ["$price", "$stock"] } }
            }}
        ]);

        // Get top selling products
        const topSellingProducts = await Bills.aggregate([
            { $unwind: "$cartItems" },
            { $group: {
                _id: "$cartItems._id",
                productName: { $first: "$cartItems.name" },
                totalQuantity: { $sum: "$cartItems.quantity" }
            }},
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

        // Get stock by category
        const stockByCategory = await Product.aggregate([
            { $group: {
                _id: "$category",
                totalStock: { $sum: "$stock" },
                count: { $sum: 1 }
            }}
        ]);

        res.status(200).json({
            lowStockItems,
            inventoryStats: inventoryStats[0] || {
                totalProducts: 0,
                totalStock: 0,
                totalValue: 0
            },
            topSellingProducts,
            stockByCategory
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Error fetching analytics' });
    }
};