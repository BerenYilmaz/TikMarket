const Product = require("../models/Product");
const { getCache, setCache, deleteCache } = require("../config/redis");

// ─── Cache key helpers ───────────────────────────────────────────
const listKey  = (cat, q) => `products:list:${cat || "all"}:${q || ""}`;
const detailKey = (id)    => `products:detail:${id}`;

const invalidateListCache = async (category) => {
  // Kategori ve "all" listesi iptal edilir
  await deleteCache(listKey(category, ""));
  await deleteCache(listKey("all", ""));
};

// ─── GET /api/products ───────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const key = listKey(category, search);

    // 1. Redis önbelleğinden dene
    const cached = await getCache(key);
    if (cached) {
      console.log(`⚡ [Redis] Cache HIT → ${key}`);
      return res.status(200).json({
        success: true,
        cached: true,
        count: cached.length,
        data: cached,
      });
    }

    // 2. MongoDB'den çek
    console.log(`🔍 [Redis] Cache MISS → ${key} — DB'den alınıyor`);
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search)   filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter)
      .populate("seller", "name")
      .sort({ createdAt: -1 });

    // 3. Önbelleğe yaz (5 dakika)
    await setCache(key, products, 300);

    res.status(200).json({
      success: true,
      cached: false,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/products/:productId ───────────────────────────────
const getProduct = async (req, res) => {
  try {
    const key = detailKey(req.params.productId);

    // 1. Redis önbelleğinden dene
    const cached = await getCache(key);
    if (cached) {
      console.log(`⚡ [Redis] Cache HIT → ${key}`);
      return res.status(200).json({ success: true, cached: true, data: cached });
    }

    // 2. MongoDB'den çek
    console.log(`🔍 [Redis] Cache MISS → ${key} — DB'den alınıyor`);
    const product = await Product.findById(req.params.productId)
      .populate("seller", "name email");

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 3. Önbelleğe yaz (10 dakika)
    await setCache(key, product, 600);

    res.status(200).json({ success: true, cached: false, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/products ─────────────────────────────────────────
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    const product = await Product.create({
      name, description, price, category, stock, images,
      seller: req.user._id,
    });

    // Önbelleği temizle
    await invalidateListCache(category);
    console.log(`🗑️  [Redis] Cache temizlendi → yeni ürün (${category})`);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/products/:productId ───────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const allowedUpdates = ["name", "description", "price", "category", "stock", "images", "isActive"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });
    await product.save();

    // Önbelleği temizle
    await deleteCache(detailKey(product._id.toString()));
    await invalidateListCache(product.category);
    console.log(`🗑️  [Redis] Cache temizlendi → güncellenen ürün (${product._id})`);

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/products/:productId ────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Önbelleği temizle
    await deleteCache(detailKey(product._id.toString()));
    await invalidateListCache(product.category);
    console.log(`🗑️  [Redis] Cache temizlendi → silinen ürün (${product._id})`);

    await product.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllProducts, addProduct, updateProduct, deleteProduct, getProduct };
