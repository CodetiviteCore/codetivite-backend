const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDatabase } = require("./src/config/database");
const { userroutes } = require("./src/routes/v1/users-routes");
const { OK, NOT_FOUND } = require("./src/utility/status-codes");
require("dotenv")
.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });


const app = express();
connectDatabase();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (_, res) =>
  res.status(OK).sendFile(path.join(__dirname, "/index.html"))
);

//Sends an html - that welcoms the user and has a way to link to documentation
app.use("/api/v1.0/user", userroutes);
app.all("*", (_, res) => res.status(NOT_FOUND).send({ message: "route not found" }));

app.listen(process.env.PORT, () => {
  console.log(
    `Listening on ${process.env.PORT}\n${
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? "Visit http://localhost:5121/"
        : ""
    }`
  );
});
