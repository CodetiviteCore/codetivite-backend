const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { getProjectsDueForSyllabus, updateSyllabusStatus, getProjectsCompleted } = require("../../handlers/project-handler");
const { isWhitelisted } = require("../../middlewares/isWhitelisted");
const { restrictAccess } = require("../../middlewares/isRestricted");

module.exports = Router()
    .get("/", authenticateMiddleware, isWhitelisted, restrictAccess, getProjectsDueForSyllabus)
    .put("/me", authenticateMiddleware, isWhitelisted, updateSyllabusStatus)
    .get("/me", authenticateMiddleware, isWhitelisted, getProjectsCompleted);
