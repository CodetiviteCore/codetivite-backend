const { Router } = require("express");
const { getUserRoadMap, getRoadMap, getRoadMapIds, getRoadMapById, getUserRoadMapProgressInPercent } = require("../../handlers/roadmap-handler");
const { authenticateMiddleware } = require("../../middlewares/authorize");

module.exports = Router()
    .get("/", authenticateMiddleware, getRoadMap)
    .get("/ids", authenticateMiddleware, getRoadMapIds) 
    .get("/me", authenticateMiddleware, getUserRoadMap)
    .get("/me/progress", authenticateMiddleware, getUserRoadMapProgressInPercent)
    .get("/id/:id", authenticateMiddleware, getRoadMapById);