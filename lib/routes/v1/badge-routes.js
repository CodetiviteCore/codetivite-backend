const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { updateUserBadge } = require("../../handlers/badge-handler");

module.exports = Router()
    .put("/", authenticateMiddleware, updateUserBadge);