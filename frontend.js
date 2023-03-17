const fe = require("express")();
const path = require("path")

fe.get("/", (_, res) => res.sendFile(path.join(__dirname, "/index.html")));

fe.listen("3000", () => console.log("connectde to the fron end"));
