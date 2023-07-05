const { Router } = require("express");

module.exports = Router()
  .use("/users", require("./users-routes"))
  .use("/roadmap", require("./roadmap-routes"))
  .use("/project", require("./project-routes"))
  .use("/badge", require("./badge-routes"))
  .use("/dashboard", require("./dashboard-routes"))
  .use("/auth", require("./auth-routes"));
