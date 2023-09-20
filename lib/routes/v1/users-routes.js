const { Router } = require("express");
const {
  addToMailList,
  updateCareerPath,
  renderCareerPaths,
  getUser,
  contactUs,
} = require("../../handlers/users-handlers");
const { authenticateMiddleware } = require("../../middlewares/authorize");

module.exports = Router()
  .post("/mail-list", addToMailList)
  .post("/contact-us", contactUs)
  .put("/career-path", authenticateMiddleware, updateCareerPath)
  .get("/get-user", authenticateMiddleware, getUser)
  .get("/career-path", authenticateMiddleware, renderCareerPaths);
