const express     = require("express");
const router      = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getProfile, addAddress, deleteAddress } = require("../controllers/userController");

router.get(    "/profile",              protect, getProfile);
router.post(   "/addresses",            protect, addAddress);
router.delete( "/addresses/:addressId", protect, deleteAddress);

module.exports = router;