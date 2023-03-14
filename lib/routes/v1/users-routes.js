const { Router } = require("express");
const { addToMailList } = require("../../handlers/users-handlers");

module.exports = Router().post("/add-to-mail-list", addToMailList);
