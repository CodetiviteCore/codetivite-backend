const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { getUserDashboard, trackLoginActivity } = require("../../handlers/dashboard-handler");
const { isWhitelisted } = require("../../middlewares/isWhitelisted");

module.exports = Router()
    .get("/", authenticateMiddleware, isWhitelisted, getUserDashboard)
    .get("/login-activity", authenticateMiddleware, isWhitelisted, trackLoginActivity);
