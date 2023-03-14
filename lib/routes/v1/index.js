const { Router } = require("express");

module.exports = Router()
  .use("/", async (_, res) => {
    res.send("Welcome to codetivite's backend api v1.0 :)");
  })
  .use("/users", require("./users-routes"))
  .use("/auth", require("./auth-routes"));
