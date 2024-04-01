const { Cluster } = require("puppeteer-cluster");

const { crawl, data } = require("../index");

async function parallelCrawl() {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 20,
  });

  await cluster.task(async ({ page, data: url }) => {
    await crawl(url, page);
  });

  for (let i = 0; i < data.length; i++) {
    cluster.queue(data[i]);
  }
  await cluster.idle();
  await cluster.close();
}

parallelCrawl();
