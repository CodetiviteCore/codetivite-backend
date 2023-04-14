const { Router } = require("express");
const { getUserRoadMap, getRoadMap } = require("../../handlers/roadmap-handler");
const { authenticateMiddleware } = require("../../middlewares/authorize");

module.exports = Router()
    .get("/", authenticateMiddleware, getRoadMap)
    .get("/user", authenticateMiddleware, getUserRoadMap);