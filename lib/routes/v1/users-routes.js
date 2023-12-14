const { Router } = require("express");
const {
  addToMailList,
  updateCareerPath,
  renderCareerPaths,
  getUser,
  contactUs,
  updateUser
} = require("../../handlers/users-handlers");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { isWhitelisted } = require("../../middlewares/isWhitelisted");

module.exports = Router()
  .post("/mail-list", addToMailList)
  .post("/contact-us", contactUs)
  .put("/career-path", authenticateMiddleware, isWhitelisted, updateCareerPath)
  .get("/get-user", authenticateMiddleware, isWhitelisted, getUser)
  .get("/career-path", authenticateMiddleware, isWhitelisted, renderCareerPaths)
  .put("/update-user", authenticateMiddleware, isWhitelisted, updateUser);
