const { PORT, NODE_ENV } = require("./lib/config/env")
const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./lib/config/database");
const apiRoutes = require("./lib/routes");
const {
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("./lib/utils/status-codes");
const { errorHandler } = require("./lib/handlers/error-handler");
const { addProjectsToJson, createProject } = require("./lib/utils/extract-projects");
const cron = require('./lib/utils/healthCheck-utils');

const app = express();
try {
  connectDatabase();
} catch (error) {
  res.status(INTERNAL_SERVER_ERROR).send({ message: "Error Connecting to Db" })
}

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

cron.start();

app.listen(PORT, () => {
  console.log(
    `Listening on port:${PORT}${NODE_ENV === "development"
      ? `\nVisit http://localhost:${PORT}/`
      : ""
    }`
  );
});
