const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { getUserDashboard } = require("../../handlers/dashboard-handler");

module.exports = Router().get("/", authenticateMiddleware, getUserDashboard);
