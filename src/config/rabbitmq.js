const amqp = require("amqplib");

let connection;
let channel;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://admin:admin123@localhost:5672"
    );
    channel = await connection.createChannel();

    // Queues oluştur
    await channel.assertQueue("order_notifications", { durable: true });
    await channel.assertQueue("cart_events", { durable: true });

    console.log("✅ RabbitMQ Connected");
  } catch (error) {
    console.log("⚠️  RabbitMQ başlatılamadı:", error.message);
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
