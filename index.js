const path = require("path");
const puppeteer = require("puppeteer");

const readCSVSingleColumn = require("./helpers/loadCSVData");
const geocodeAddress = require("./helpers/geocoder");
const connectToDB = require("./database/connectToDB");

const pathToWebstites = path.join(__dirname, "assets", "websites.csv");

const data = readCSVSingleColumn(pathToWebstites).flatMap((arr) => arr);

(async () => {
  await connectToDB();
})();

async function crawl(url) {
  try {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    const initialUrl = `https://www.${url}`;
    const addressRegex1 =
      /\b(?:Avenue|Boulevard|Drive|Lane|Road|Street|Ave|Blvd|Rd|St|Heights|Way)(?:\s*(?:[NnEeWwSs]\b)?)?\b/i;

    await page.goto(initialUrl);

    const innerLinks = await findInnerLinks(page);

    const allElements = await filterElements(innerLinks, addressRegex1, page);

    // const innerLinks = await page.evaluate(() => {
    //   let links = Array.from(document.querySelectorAll("a[href]")).map(
    //     (link) => link.href
    //   );
    //   links = links.filter(
    //     (link) =>
    //       link && link.match(/(?:contact|about|connect)\s?(?:us|with us)?\b/gi)
    //   );
    //   return Array.from(new Set(links));
    // });

    // let allElements = [];

    // for (let i = 0; i < innerLinks.length; i++) {
    //   await page.goto(innerLinks[i]);
    //   let elements = await page.$$eval(
    //     "p, span, h1, h2, h3, h4, h5, strong",
    //     (elements) => elements.map((element) => element.innerText)
    //   );

    //   elements = elements.filter((element) => element.match(addressRegex1));

    //   allElements = [...elements];
    //   allElements = Array.from(
    //     new Set(allElements.filter((element) => element.length < 100))
    //   );
    // }

    const locations = await getLocations(allElements, url);

    // if (allElements.length === 0) {
    //   console.error("No addresses found");
    // } else {
    //   const result = await geocodeAddress(...allElements);
    //   console.log("For ", url, result);
    // }

    await browser.close();
  } catch (e) {
    console.log(e.message);
  }
}

async function findInnerLinks(page) {
  const innerLinks = await page.evaluate(() => {
    let links = Array.from(document.querySelectorAll("a[href]")).map(
      (link) => link.href
    );
    links = links.filter(
      (link) =>
        link && link.match(/(?:contact|about|connect)\s?(?:us|with us)?\b/gi)
    );
    return Array.from(new Set(links));
  });

  return innerLinks;
}

async function filterElements(innerLinks, addressRegex1, page) {
  let allElements = [];

  for (let i = 0; i < innerLinks.length; i++) {
    await page.goto(innerLinks[i]);
    let elements = await page.$$eval(
      "p, span, h1, h2, h3, h4, h5, strong",
      (elements) => elements.map((element) => element.innerText)
    );

    elements = elements.filter((element) => element.match(addressRegex1));

    allElements = [...elements];
    allElements = Array.from(
      new Set(allElements.filter((element) => element.length < 100))
    );
  }

  return allElements;
}

async function getLocations(allElements, url) {
  if (allElements.length === 0) {
    console.error("No addresses found");
  } else {
    const result = await geocodeAddress(...allElements);
    console.log("For ", url, result);
  }
}

function run() {
  for (let i = 0; i < 10; i++) {
    crawl(data[i]);
  }
}

run();

// for (let i = 0; i < 10; i++) {
//   crawl(data[i]);
// }
