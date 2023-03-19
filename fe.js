const fe = require("express")();
const path = require("path")

fe.get("/", (req, res) =>
  res.status(200).sendFile(path.join(__dirname, "/index.html"))
);

fe.listen("3000", () => console.log("Server is running"));
