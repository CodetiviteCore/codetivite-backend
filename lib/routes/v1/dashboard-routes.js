const { Router } = require("express");
const { getUserDashboard } = require("../../handlers/dashboard-handler");

module.exports = Router().get("/", getUserDashboard);
