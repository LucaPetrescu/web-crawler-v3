const fs = require("fs");

function readCSVSingleColumn(path) {
  let data = fs
    .readFileSync(path)
    .toString()
    .split("\n")
    .slice(1)
    .map((e) => e.trim())
    .map((e) => e.split(",").map((e) => e.trim()));

  return data;
}

module.exports = readCSVSingleColumn;
