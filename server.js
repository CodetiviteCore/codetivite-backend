const express = require("express");
const cors = require("cors");
const { userroutes } = require("./src/routes");
const { addToMailList } = require("./src/controller/userController");
const { database } = require("./src/config/database");

const app = express();
database();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (_, res) =>
  res.status(200).send({
    message: "Welcome to Codetivite API",
  })
);
app.use("/v1.0/api", userroutes);
app.all("*", (req, res) => res.send({ message: "route not found" }));  

app.listen(5001, () => {
  console.log("Listening on 5001");
});
