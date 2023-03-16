const { Router, request, response } = require("express");
const {
  addToMailList,
  careerPath,
  newUser,
} = require("../../controller/users-controller");
const authorize = require("../../middlewares/authorize")

const userroutes = Router();

userroutes.post("/add-to-mail-list", addToMailList);

userroutes.post("/add-user", newUser);

userroutes.get("/career-path", authorize, careerPath);

module.exports = { userroutes };
