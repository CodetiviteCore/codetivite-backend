const { Router } = require("express");
const { authenticateMiddleware } = require("../../middlewares/authorize");
const { updateUserBadge, awardBadge } = require("../../handlers/badge-handler");
const { isWhitelisted } = require("../../middlewares/isWhitelisted");

module.exports = Router()
    .put("/", authenticateMiddleware, isWhitelisted, updateUserBadge)
    .put("/award-badge", authenticateMiddleware, isWhitelisted, awardBadge);