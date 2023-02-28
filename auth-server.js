const express = require("express");
const app = express();
const { google } = require("googleapis");
const client_secret = require("./client_secret.json");
let token;

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
  scope: "https://www.googleapis.com/auth/userinfo.profile",
  include_granted_scopes: true,
});

app.get("/test", async (req, res) => {
  // This will provide an object with the access_token and refresh_token.
  // Save these somewhere safe so they can be used at a later time.

  res.send("This route is just for testing");
});

app.get("/login", (_, res) => {
  // Example on redirecting user to Google's OAuth 2.0 server.
  // await res.writeHead(301, { Location: authorizationUrl });
  // await res.send(authorizationUrl);
  res.redirect(authorizationUrl);
});

app.get("/", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  token = tokens.access_token
  oauth2Client.setCredentials(tokens);
  console.log(tokens);
  res.send("Successfully authenticated access_token is " + token);
});

app.listen(5000, () => {
  console.log("Server listening at port 5000");
});
