const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

dotenv.config({
  path: path.resolve(process.cwd(), ".env.test"),
});

module.exports = process.env;
