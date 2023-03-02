const { Router, request, response } = require("express");
const { addToMailList, login, home } = require("../controller/userController");

const userRouter = Router();
userRouter.post("/mailList", addToMailList);
userRouter.get('/', home);
userRouter.get('/login', login);
module.exports = userRouter;