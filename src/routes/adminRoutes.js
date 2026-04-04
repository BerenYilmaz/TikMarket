const express       = require("express");
const router        = express.Router();
const { protect }   = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { getDashboard } = require("../controllers/adminController");
const {
  getAllProducts, addProduct,
  updateProduct, deleteProduct,
} = require("../controllers/productController");

router.get(    "/dashboard",          protect, adminOnly, getDashboard);
router.get(    "/products",           protect, adminOnly, getAllProducts);
router.post(   "/products",           protect, adminOnly, addProduct);
router.put(    "/products/:productId",protect, adminOnly, updateProduct);
router.delete( "/products/:productId",protect, adminOnly, deleteProduct);

module.exports = router;