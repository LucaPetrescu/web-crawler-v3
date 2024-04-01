const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "opencage",
  apiKey: "--your-API-key--",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

async function geocodeAddress(address) {
  try {
    const res = await geocoder.geocode(address);
    return res;
  } catch (error) {
    console.error("Error during geocoding:", error);
    return null;
  }
}

module.exports = geocodeAddress;
