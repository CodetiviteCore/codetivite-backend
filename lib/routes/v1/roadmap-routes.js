const { Router } = require("express");
const { getUserRoadMap, getRoadMap, getRoadMapIds, getRoadMapById, getUserRoadMapProgressInPercent, getSkillLevel } = require("../../handlers/roadmap-handler");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { isWhitelisted } = require("../../middlewares/isWhitelisted");

module.exports = Router()
    .get("/", authenticateMiddleware, isWhitelisted, getRoadMap)
    .get("/ids", authenticateMiddleware, isWhitelisted, getRoadMapIds) 
    .get("/me", authenticateMiddleware, isWhitelisted, getUserRoadMap)
    .get("/me/progress", authenticateMiddleware, isWhitelisted, getUserRoadMapProgressInPercent)
    .get("/skill-levels", getSkillLevel)
    .get("/id/:id", authenticateMiddleware, isWhitelisted, getRoadMapById);