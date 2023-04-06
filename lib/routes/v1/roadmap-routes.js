const { Router } = require("express");
const { getRoadMap } = require("../../handlers/roadmap-handler");

module.exports = Router().get("/", getRoadMap);