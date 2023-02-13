const mongoose = require("mongoose");

exports.database = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to database...");
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
