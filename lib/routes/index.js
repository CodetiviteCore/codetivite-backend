const { Router, json, urlencoded } = require("express");

module.exports = Router()
  .use(json())
  .use(urlencoded({ extended: false }))
  .use("/", async (_, res) => {
    res.send("Welcome to codetivite's backend api :)");
  })
  .use("/v1.0", require("./v1"));
