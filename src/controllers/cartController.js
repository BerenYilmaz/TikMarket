const Cart    = require("../models/Cart");
const Product = require("../models/Product");
const { publishMessage } = require("../config/rabbitmq");

// ─── GET /api/cart ───────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product", "name price images isActive"
    );
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [], totalAmount: 0 } });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/cart/items ────────────────────────────────────────
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], totalAmount: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, priceAtTime: product.price });
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.priceAtTime * item.quantity, 0
    );
    await cart.save();

    // ── RabbitMQ: cart_events kuyruğuna mesaj gönder ──
    await publishMessage("cart_events", {
      event: "ITEM_ADDED",
      userId:      req.user._id,
      userEmail:   req.user.email,
      productId,
      productName: product.name,
      quantity,
      price:       product.price,
      totalAmount: cart.totalAmount,
      timestamp:   new Date().toISOString(),
    });

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/cart/items/:itemId ─────────────────────────────────
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

    item.quantity = quantity;
    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.priceAtTime * i.quantity, 0
    );
    await cart.save();

    // ── RabbitMQ: güncelleme eventi ──
    await publishMessage("cart_events", {
      event:       "ITEM_UPDATED",
      userId:      req.user._id,
      itemId:      req.params.itemId,
      newQuantity: quantity,
      totalAmount: cart.totalAmount,
      timestamp:   new Date().toISOString(),
    });

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/cart/items/:itemId ──────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemExists = cart.items.id(req.params.itemId);
    if (!itemExists) return res.status(404).json({ success: false, message: "Item not found in cart" });

    cart.items.pull({ _id: req.params.itemId });
    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.priceAtTime * i.quantity, 0
    );
    await cart.save();

    // ── RabbitMQ: silme eventi ──
    await publishMessage("cart_events", {
      event:     "ITEM_REMOVED",
      userId:    req.user._id,
      itemId:    req.params.itemId,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({ success: true, message: "Item removed", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/cart/checkout ─────────────────────────────────────
const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product", "name price"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Sepet boş" });
    }

    const { addressId } = req.body;
    const shipping = cart.totalAmount >= 500 ? 0 : 29.99;
    const grandTotal = cart.totalAmount + shipping;

    // ── RabbitMQ: order_notifications kuyruğuna sipariş gönder ──
    await publishMessage("order_notifications", {
      event:      "ORDER_PLACED",
      userId:     req.user._id,
      userEmail:  req.user.email,
      addressId,
      items:      cart.items.map(i => ({
        productName: i.product?.name,
        quantity:    i.quantity,
        price:       i.priceAtTime,
      })),
      itemCount:  cart.items.length,
      subtotal:   cart.totalAmount,
      shipping,
      grandTotal,
      timestamp:  new Date().toISOString(),
    });

    // Sepeti temizle
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Sipariş başarıyla oluşturuldu!",
      data: { grandTotal, shipping },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, checkout };
