const { Router } = require("express");
const {
  healthCheck
} = require("../../utils/healthCheck-utils");

module.exports = Router()
  .get("/", healthCheck)