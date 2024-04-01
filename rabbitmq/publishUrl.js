const amqp = require("amqplib/callback_api");

const { data } = require("../index");

async function publishUrl(url) {
  amqp.connect("amqp://localhost", (err, conn) => {
    if (err) {
      console.error("Error connecting to RabbitMQ:", err);
      return;
    }
    conn.createChannel((err, ch) => {
      if (err) {
        console.error("Error creating channel:", err);
        return;
      }
      const queue = "puppeteer_tasks";
      ch.assertQueue(queue, { durable: false });
      ch.sendToQueue(queue, Buffer.from(url));
      console.log(`Published URL: ${url}`);
    });
  });
}

for (let i = 0; i < data.length; i++) {
  publishUrl(data[i]);
}

module.exports = publishUrl;
