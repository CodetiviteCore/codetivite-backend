const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const routes = require("../routes");
const { PORT } = require("../config/env");
const { database } = require("../config/database");

class SetupServer {
  app = express();
  server;

  /*
   * same as this.port = port, declaring as private here will
   * add the port variable to the SetupServer instance
   */
  constructor(port = PORT) {
    this.port = port;
  }

  /*
   * We use a different method to init instead of using the constructor
   * this way we allow the server to be used in tests and normal initialization
   */
  async init() {
    this.setupExpress();
    this.setupControllers();

    //must be the last
    this.setupErrorHandlers();
  }

  //Step One
  setupExpress() {
    database();
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
   
    this.app.use(
      cors({
        origin: "*",
      })
    );    
  }

  //Step two
  setupControllers() {
    this.app.get("/", (req, res) =>
      res.status(200).send({
        message: "Welcome to Codetivite",
      })
    );
    this.app.use("/v1.0/api", routes);
    this.app.all("*", (req, res) => res.send({ message: "route not found" }));
  }

  setupErrorHandlers() {
    this.app.use((err, _, res, __) => {
      if (err.name === "HttpError") {
        return res.status(500).json({ success: false, error: err.name });
      }
      res
        .status(500)
        .json({ success: false, error: `An error occurred\n ${err.message}` });
    });
  }

  getApp() {
    return this.app;
  }

  async close() {
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server.close((err) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }

  start() {
    this.server = this.app.listen(this.port || 4001, () => {
      console.log("Server listening on port: " + this.port);
    });
  }
}

module.exports = SetupServer;