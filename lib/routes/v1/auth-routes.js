const { Router } = require("express");
const { authenticate, login, loginWithMagicLink } = require("../../handlers/auth-handler");

module.exports = Router()
.get("/", authenticate)
.get("/login", login)
.post("/magic-login", loginWithMagicLink);
