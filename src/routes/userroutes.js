const { Router, request, response } = require("express");
const { addToMailList } = require("../controller/userController");

const userRouter = Router();
userRouter.post("/mailList", addToMailList);
module.exports = userRouter;