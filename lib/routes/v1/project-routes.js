const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { getProjectsDueForSyllabus, updateSyllabusStatus } = require("../../handlers/project-handler");

module.exports = Router()
    .get("/", authenticateMiddleware, getProjectsDueForSyllabus)
    .put("/me", authenticateMiddleware, updateSyllabusStatus);