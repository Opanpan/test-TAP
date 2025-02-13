const express = require("express");
const amqp = require("amqplib");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "task_queue";

async function sendToQueue(message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
    console.log(" [x] Sent '%s'", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
  }
}

app.post("/send", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  await sendToQueue(message);
  res.json({ success: true, message: "Message sent" });
});

app.listen(5000, () => console.log("Producer running on port 5000"));
