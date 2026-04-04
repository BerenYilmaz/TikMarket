const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const cartRoutes    = require("./routes/cartRoutes");
const authRoutes    = require("./routes/authRoutes");
const userRoutes    = require("./routes/userRoutes");
const adminRoutes   = require("./routes/adminRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://tik-market-fmbxnm54a-berenyilmazs-projects.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/admin",    adminRoutes);

app.get("/", (req, res) => res.json({ message: "TikMarket API is running 🚀" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));