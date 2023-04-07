const { Router } = require("express");
const { getRoadMap } = require("../../handlers/roadmap-handler");
const { authenticateMiddleware } = require("../../middlewares/authorize");

module.exports = Router().get("/", authenticateMiddleware, getRoadMap);