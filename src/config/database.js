const mongoose = require("mongoose");
require('dotenv').config();

exports.connectDatabase = () => {
  mongoose
    .set("strictQuery", false)
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to database...");
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
