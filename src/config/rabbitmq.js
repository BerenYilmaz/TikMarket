const amqp = require("amqplib");

let connection;
let channel;

const connectRabbitMQ = async () => {
  const MAX_RETRIES = 10;
  const RETRY_DELAY = 5000; // 5 saniye

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://admin:admin123@localhost:5672"
      );
      channel = await connection.createChannel();

      await channel.assertQueue("order_notifications", { durable: true });
      await channel.assertQueue("cart_events", { durable: true });

      // Bağlantı kopunca otomatik yeniden bağlan
      connection.on("close", () => {
        console.log("⚠️  RabbitMQ bağlantısı kapandı, 5sn sonra yeniden bağlanılıyor...");
        channel = null;
        connection = null;
        setTimeout(connectRabbitMQ, RETRY_DELAY);
      });

      connection.on("error", (err) => {
        console.log("⚠️  RabbitMQ bağlantı hatası:", err.message);
      });

      console.log("✅ RabbitMQ Connected");
      return; // Başarılı → döngüden çık

    } catch (error) {
      console.log(`⏳ RabbitMQ bağlantı denemesi ${attempt}/${MAX_RETRIES} → ${error.message}`);

      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.log("⚠️  RabbitMQ bağlantısı kurulamadı, uygulama RabbitMQ olmadan çalışıyor.");
      }
    }
  }
};

const publishMessage = async (queue, message) => {
  try {
    if (!channel) return;
    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    console.log(`📨 Mesaj gönderildi → ${queue}:`, message);
  } catch (error) {
    console.log("Mesaj gönderilemedi:", error.message);
  }
};

const consumeMessages = async (queue, callback) => {
  try {
    if (!channel) return;
    await channel.consume(queue, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log("Mesaj alınamadı:", error.message);
  }
};

module.exports = { connectRabbitMQ, publishMessage, consumeMessages };
