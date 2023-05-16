const { PORT, NODE_ENV } = require("./lib/config/env")
const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./lib/config/database");
const apiRoutes = require("./lib/routes");
const {
  OK,
  NOT_FOUND,
} = require("./lib/utils/status-codes");
const { errorHandler } = require("./lib/handlers/error-handler");

const app = express();
connectDatabase();

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (_, res) => {
  res.status(OK).send("Welcome to Codetivite :)");
});

app.use("/api", apiRoutes);
app.all("*", (_, res) =>
  res.status(NOT_FOUND).send({ message: "route not found" })
);

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(
    `Listening on port:${PORT}${NODE_ENV === "development"
      ? `\nVisit http://localhost:${PORT}/`
      : ""
    }`
  );
});
