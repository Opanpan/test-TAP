const express = require('express');
const amqp = require('amqplib');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'task_queue';

const messages = [];

async function consumeQueue() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(' [*] Waiting for messages. To exit, press CTRL+C');

    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        console.log(' [x] Received:', msg.content.toString());
        messages.push(msg.content.toString())
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error);
  }
}

consumeQueue();

app.get('/messages', (req, res) => {
  res.json({ success: true, data: messages });
});

app.listen(5001, () => console.log('Consumer running on port 5001'));
