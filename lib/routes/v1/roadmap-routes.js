const { Router } = require("express");
const { getUserRoadMap } = require("../../handlers/roadmap-handler");
const { authenticateMiddleware } = require("../../middlewares/authorize");

module.exports = Router()
    .get("/", authenticateMiddleware, getUserRoadMap);