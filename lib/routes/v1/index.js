const { Router } = require("express");

module.exports = Router()
  .use("/users", require("./users-routes"))
  .use("/roadmap", require("./roadmap-routes"))
  .use("/auth", require("./auth-routes"));
