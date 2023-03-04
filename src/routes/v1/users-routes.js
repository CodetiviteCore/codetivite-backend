const { Router, request, response } = require("express");
const { addToMailList } = require("../../controller/users-controller");

const userroutes = Router();
userroutes.post("/add-to-mail-list", addToMailList);
module.exports = { userroutes };
