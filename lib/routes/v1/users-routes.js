const { Router } = require("express");
const { addToMailList, updateCareerPath, renderCareerPaths } = require("../../handlers/users-handlers");
const { authenticate } = require("../../handlers/auth-handler");

module.exports = Router()
.post("/add-to-mail-list", addToMailList)
.put("/career-path", authenticate, updateCareerPath)
.get("/career-path", authenticate, renderCareerPaths);

