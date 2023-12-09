const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { getProjectsDueForSyllabus, updateSyllabusStatus, getProjectsCompleted } = require("../../handlers/project-handler");
const { isWhitelisted } = require("../../middlewares/isWhitelisted");
const { restrictProjectView } = require("../../middlewares/isRestricted");

module.exports = Router()
    .get("/", authenticateMiddleware, isWhitelisted, restrictProjectView, getProjectsDueForSyllabus)
    .put("/me", authenticateMiddleware, isWhitelisted, updateSyllabusStatus)
    .get("/me", authenticateMiddleware, isWhitelisted, getProjectsCompleted);
