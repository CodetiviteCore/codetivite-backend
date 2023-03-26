const { Router, json, urlencoded } = require("express");
const { OK } = require("../utils/status-codes");
const path = require("path");

module.exports = Router()
  .use(json())
  .use(urlencoded({ extended: false }))
  .use("/v1.0", require("./v1"));
