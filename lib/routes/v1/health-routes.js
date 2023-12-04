const { Router } = require("express");
const {
  healthCheck
} = require("../../utils/health-utils");

module.exports = Router()
  .get("/", healthCheck)