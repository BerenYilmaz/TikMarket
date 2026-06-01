const redis = require("redis");

let client;

const connectRedis = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    client.on("error", (err) => {
      console.log("⚠️  Redis bağlantı hatası:", err.message);
    });

    await client.connect();
    console.log("✅ Redis Connected");
  } catch (error) {
    console.log("⚠️  Redis başlatılamadı:", error.message);
  }
};

const getCache = async (key) => {
  try {
    if (!client || !client.isOpen) return null;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

const setCache = async (key, value, ttl = 300) => {
  try {
    if (!client || !client.isOpen) return;
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.log("Cache set hatası:", error.message);
  }
};

const deleteCache = async (key) => {
  try {
    if (!client || !client.isOpen) return;
    await client.del(key);
  } catch (error) {
    console.log("Cache delete hatası:", error.message);
  }
};

module.exports = { connectRedis, getCache, setCache, deleteCache };
