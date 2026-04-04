const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  fullName:    { type: String, required: true },
  phone:       { type: String, required: true },
  city:        { type: String, required: true },
  district:    { type: String, required: true },
  addressLine: { type: String, required: true },
  postalCode:  { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true, minlength: 6, select: false },
    phone:     { type: String },
    role:      { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);