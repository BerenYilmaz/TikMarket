const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { title, fullName, phone, city, district, addressLine, postalCode } = req.body;
    const user = await User.findById(req.user._id);
    user.addresses.push({ title, fullName, phone, city, district, addressLine, postalCode });
    await user.save();
    res.status(201).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    user.addresses.pull({ _id: req.params.addressId });
    await user.save();
    res.status(200).json({ success: true, message: "Address deleted", data: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, addAddress, deleteAddress };