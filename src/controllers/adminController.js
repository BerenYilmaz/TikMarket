const User    = require("../models/User");
const Product = require("../models/Product");
const Cart    = require("../models/Cart");

const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalCarts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Cart.countDocuments(),
    ]);
    const revenueData = await Cart.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalActiveCarts: totalCarts,
        estimatedRevenue: revenueData[0]?.totalRevenue || 0,
        productsByCategory,
        systemStatus: {
          status: "healthy",
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard };