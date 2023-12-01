const { Router } = require("express");
const {
  healthCheck
} = require("../../handlers/health-handler");

module.exports = Router()
  .get("/", healthCheck)