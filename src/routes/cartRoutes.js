const express     = require("express");
const router      = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getCart, addToCart, updateCartItem, removeFromCart, checkout } = require("../controllers/cartController");

router.use(protect);

router.get(    "/",              getCart);
router.post(   "/items",         addToCart);
router.put(    "/items/:itemId", updateCartItem);
router.delete( "/items/:itemId", removeFromCart);
router.post(   "/checkout",      checkout);

module.exports = router;