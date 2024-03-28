const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Locations");
    console.log("Connected to database");
  } catch (error) {
    handleError(error);
  }
}

module.exports = connectToDB;
