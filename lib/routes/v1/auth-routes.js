const { Router } = require("express");
const { authenticate, login } = require("../../handlers/auth-handler");

module.exports = Router().get("/", authenticate).get("/login", login);
