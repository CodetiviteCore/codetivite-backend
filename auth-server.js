const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

const PORT = 5000;

// midlleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(PORT, () => {
  console.log("server started at port 5000");
});
