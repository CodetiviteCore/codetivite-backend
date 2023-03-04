const express = require("express");
const app = express();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const client_secret = require("./client_secret.json");

let id_token;
let payLoad;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.get("/login", (_, res) => {
  res.redirect(authorizationUrl);
});

app.get("/", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);

  token = tokens.access_token;
  id_token = tokens.id_token;

  oauth2Client.setCredentials(tokens);

  verify(id_token).catch(console.error);

  res.send("Successfully authenticated");
});

app.listen(5000, () => {
  console.log("Server listening at port 5000");
});
