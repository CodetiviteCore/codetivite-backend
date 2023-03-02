const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDatabase } = require("./src/config/database");
const { userroutes } = require("./src/routes/v1/users-routes");
const { OK, NOT_FOUND } = require("./src/utility/status-codes");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const client_secret = require("./client_secret.json");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const app = express();
connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

let id_token;
let payLoad;
let token;

const oauth2Client = new google.auth.OAuth2(
  client_secret.web.client_id,
  client_secret.web.client_secret,
  client_secret.web.redirect_uris[0]
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

///Configuraciones de Google
const client = new OAuth2Client(client_secret.web.client_id);
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: client_secret.web.client_id, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  payLoad = JSON.stringify(payload);

  const userId = payload.sub;

  console.log(JSON.stringify(payload));
}

app.get("/", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);

  token = tokens.access_token;
  id_token = tokens.id_token;

  oauth2Client.setCredentials(tokens);

  verify(id_token).catch(console.error);
  console.log(id_token);

  res.status(OK).sendFile(path.join(__dirname, "/index.html"));
  // res.send("Success");
});

app.get("/login", (_, res) => {
  res.redirect(authorizationUrl);
});

//Sends an html - that welcoms the user and has a way to link to documentation
app.use("/api/v1.0/user", userroutes);
app.all("*", (_, res) =>
  res.status(NOT_FOUND).send({ message: "route not found" })
);

app.listen(process.env.PORT, () => {
  console.log(
    `Listening on ${process.env.PORT}\n${
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? "Visit http://localhost:5121/"
        : ""
    }`
  );
});
