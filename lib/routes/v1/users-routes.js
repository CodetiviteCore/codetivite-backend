const { Router } = require("express");
const { addToMailList, updateCareerPath, renderCareerPaths } = require("../../handlers/users-handlers");
const { authenticateMiddleware } = require("../../middlewares/authorize");


module.exports = Router()
.post("/add-to-mail-list", addToMailList)
.put("/career-path", authenticateMiddleware, updateCareerPath)
.get("/career-path", authenticateMiddleware, renderCareerPaths);