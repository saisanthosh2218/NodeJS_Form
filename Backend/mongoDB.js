const mongoose = require("mongoose");
const mongoURL = process.env.MONGODBSTRING;

const mongoConnection = mongoose
  .connect(mongoURL)
  .then(() => console.log("Database Connection Successfull"))
  .catch(() => console.log("Database Connection UnSuccessfull"));

module.exports = mongoConnection;
