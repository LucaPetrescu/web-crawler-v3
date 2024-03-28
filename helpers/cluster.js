const { Cluster } = require("puppeteer-cluster");

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 10,
  });

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);
  });

  cluster.queue("http://www.google.com/");
  cluster.queue("http://www.wikipedia.org/");
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
