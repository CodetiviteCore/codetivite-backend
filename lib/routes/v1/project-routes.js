const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { getProjectsDueForSyllabus, updateSyllabusStatus, getProjectsCompleted } = require("../../handlers/project-handler");
const { isWhitelisted } = require("../../middlewares/isWhitelisted");

module.exports = Router()
    .get("/", authenticateMiddleware, isWhitelisted, getProjectsDueForSyllabus)
    .put("/me", authenticateMiddleware, isWhitelisted, updateSyllabusStatus)
    .get("/me", authenticateMiddleware, isWhitelisted, getProjectsCompleted);
