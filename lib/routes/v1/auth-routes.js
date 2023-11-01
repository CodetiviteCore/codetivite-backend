const { Router } = require("express");
const { authenticate, login, loginWithMagicLink } = require("../../handlers/auth-handler");
const { isWhitelisted } = require("../../middlewares/isWhitelisted");

module.exports = Router()
.get("/", authenticate)
.get("/login", login)
.post("/magic-login", isWhitelisted, loginWithMagicLink);
