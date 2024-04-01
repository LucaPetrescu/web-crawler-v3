const mongoose = require("mongoose");
const Location = require("./Location");

async function insertInDB(location, url) {
  if (Array.isArray(location)) {
    let element = location[0];
    console.log(element);
    const newLocation = new Location({
      websiteName: element.url,
      latitude: element.latitude,
      longitude: element.longitude,
      countryCode: element.countryCode,
      country: element.country,
      zipcode: element.zipcode,
      streetName: element.streetName,
      streeNumber: element.streeNumber,
    });
    await newLocation.save();
  } else {
    console.log("Nothing to show");
  }
}

module.exports = insertInDB;
