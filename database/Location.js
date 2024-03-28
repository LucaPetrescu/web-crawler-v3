const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    latitude: Number,
    longitude: Number,
    country: String,
    countryCode: String,
    city: String,
    zipcode: Number,
    streetName: String,
    streetNumber: Number,
  },
  { collection: "locations" }
);

const Location = new mongoose.model("Locations", LocationSchema);

module.exports = Location;
