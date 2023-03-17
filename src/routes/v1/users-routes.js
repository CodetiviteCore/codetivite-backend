const { Router, request, response } = require("express");
const {
  addToMailList,
  updateCareerPath,
  createUser,
} = require("../../controller/users-controller");
const authorize = require("../../middlewares/authorize");

const userroutes = Router();

userroutes.post("/add-to-mail-list", addToMailList);

userroutes.post("/add-user", createUser);

userroutes.get("/career-path", authorize, updateCareerPath);

module.exports = { userroutes };
