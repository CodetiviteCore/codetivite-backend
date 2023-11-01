const { Router } = require("express");
const {
  addToWhitelist
} = require("../../handlers/whitelist-handler");

module.exports = Router()
  .post("/", addToWhitelist)