const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const { connectRabbitMQ, consumeMessages } = require("./config/rabbitmq");

const productRoutes = require("./routes/productRoutes");
const cartRoutes    = require("./routes/cartRoutes");
const authRoutes    = require("./routes/authRoutes");
const userRoutes    = require("./routes/userRoutes");
const adminRoutes   = require("./routes/adminRoutes");

connectDB();
connectRedis();
connectRabbitMQ().then(() => {
  // ── RabbitMQ Consumer'ları başlat ──
  consumeMessages("cart_events", (msg) => {
    console.log(`🛒 [RabbitMQ] cart_events → event: ${msg.event} | user: ${msg.userEmail || msg.userId} | ${msg.productName ? `ürün: ${msg.productName} (x${msg.quantity})` : `item: ${msg.itemId}`}`);
  });
  consumeMessages("order_notifications", (msg) => {
    console.log(`📦 [RabbitMQ] order_notifications → SİPARİŞ: ${msg.itemCount} ürün | toplam: ₺${msg.grandTotal?.toFixed(2)} | user: ${msg.userEmail || msg.userId}`);
  });
}).catch(() => {});  // RabbitMQ yoksa uygulama çökmez

const app = express();

app.use(cors({
  origin: "*",
  credentials: false,
}));

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/admin",    adminRoutes);

app.get("/", (req, res) => res.json({
  message: "TikMarket API is running 🚀",
  services: {
    database: "MongoDB",
    cache: "Redis",
    messageQueue: "RabbitMQ",
  }
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));