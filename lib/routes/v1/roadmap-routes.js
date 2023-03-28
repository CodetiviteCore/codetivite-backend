const { Router } = require("express");
const { getRoadMap } = require("../../handlers/roadmap-handler");
const { authenticate } = require("../../handlers/auth-handler");

module.exports = Router().get("/", authenticate, getRoadMap);