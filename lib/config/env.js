const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

module.exports = process.env;
