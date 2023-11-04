const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { getUserDashboard, updateDashboard } = require("../../handlers/dashboard-handler");
const { isWhitelisted } = require("../../middlewares/isWhitelisted");

module.exports = Router().get("/", authenticateMiddleware, isWhitelisted, getUserDashboard);

module.exports = Router().get("/updated", authenticateMiddleware, isWhitelisted, updateDashboard)
