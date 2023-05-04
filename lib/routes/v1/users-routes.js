const { Router } = require("express");
const {
  addToMailList,
  updateCareerPath,
  renderCareerPaths,
  getUser,
} = require("../../handlers/users-handlers");
const { authenticateMiddleware } = require("../../middlewares/authorize");

module.exports = Router()
.post("/add-to-mail-list", addToMailList)
.put("/career-path", authenticateMiddleware, updateCareerPath)
.put("/get-user", authenticateMiddleware, getUser)
.get("/career-path", authenticateMiddleware, renderCareerPaths);
