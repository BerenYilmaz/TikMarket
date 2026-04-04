const express     = require("express");
const router      = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAllProducts, addProduct, updateProduct,
  deleteProduct, getProduct,
} = require("../controllers/productController");

router.get(    "/",             getAllProducts);
router.post(   "/",             protect, addProduct);
router.get(    "/:productId",            getProduct);
router.put(    "/:productId",   protect, updateProduct);
router.delete( "/:productId",   protect, deleteProduct);

module.exports = router;