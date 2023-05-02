const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { getProjectsDueForSyllabus, updateSyllabusStatus, getProjectsCompleted } = require("../../handlers/project-handler");

module.exports = Router()
    .get("/", authenticateMiddleware, getProjectsDueForSyllabus)
    .put("/me", authenticateMiddleware, updateSyllabusStatus)
    .get("/me", authenticateMiddleware, getProjectsCompleted);
