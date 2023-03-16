const { Router, request, response } = require("express");
const {
  addToMailList,
  careerPath,
  newUser,
} = require("../../controller/users-controller");

const userroutes = Router();

userroutes.post("/add-to-mail-list", addToMailList);

userroutes.post("/add-user", newUser);

userroutes.get("/career-path", careerPath);

module.exports = { userroutes };
