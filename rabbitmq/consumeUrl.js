const amqp = require("amqplib/callback_api");

const { crawl } = require("../index");

const puppeteer = require("puppeteer");

async function consumeUrl() {
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
      ch.consume(
        queue,
        async (msg) => {
          const url = msg.content.toString();
          const browser = await puppeteer.launch({});
          const page = await browser.newPage();
          crawl(url, page);
          await page.close();
          await browser.close();
        },
        {
          noAck: true,
        }
      );
    });
  });
}

(async () => {
  consumeUrl();
})();

module.exports = consumeUrl;
