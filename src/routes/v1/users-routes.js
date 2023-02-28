const { Router, request, response } = require("express");
const { addToMailList } = require("../../controller/userController");

const userroutes = Router();
userroutes.post("/users/add-to-mail-list", addToMailList);
module.exports = { userroutes };
