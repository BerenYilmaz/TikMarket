const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    category:    { type: String, required: true, enum: ["giyim", "taki", "aksesuar"] },
    stock:       { type: Number, required: true, min: 0, default: 0 },
    images:      [{ type: String }],
    seller:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);