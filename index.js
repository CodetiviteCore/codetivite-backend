require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});
const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const { connectDatabase } = require("./src/config/database");
const { userroutes } = require("./src/routes/v1/users-routes");
const {
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("./src/utility/status-codes");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const client_secret = require("./client_secret.json");
const userModel = require("./src/models/user-model");
const {
  generateToken,
  getMailOptions,
  getTransport,
} = require("./src/controller/auth-controller");


const app = express();
connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

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

const client = new OAuth2Client(client_secret.web.client_id);
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: client_secret.web.client_id,
  });

  return ticket.getPayload();
}

app.get("/", async (_, res) => {
  res.status(OK).sendFile(path.join(__dirname, "/index.html"));
});

app.get("/dashboard", async (_, res) => {
  res.status(OK).sendFile(path.join(__dirname, "/index.html"));
});

app.get("/auth", async (req, res) => {
  console.log("In code")
  const code = req.query.code;
  console.log("In code code", code);

  const { tokens } = await oauth2Client.getToken(code);
  console.log("In code tokens", tokens);


  const id_token = tokens.id_token;
  oauth2Client.setCredentials(tokens);
  console.log("In code after setcredentials", id_token);

  const payload = await verify(id_token).catch(console.error);

   console.log("In code payload", payload)

  let currentUser = await userModel.findById(payload.email);
  console.log("In code currentUser", currentUser)

  //Send a mail for non-existent or inactive users
  if (!currentUser || !currentUser.lastName) {
    if (!currentUser) {     
      currentUser = new userModel({
        _id: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        userName: payload.email,
        isActive: false,
      });

      currentUser = await currentUser.save();
    } else if (!currentUser.lastName) {
     
      await userModel.updateOne(
        { _id: email },
        { lastName: payload.family_name }
      );
    }


    const link = `${process.env.FE_HOST}?code=${new URLSearchParams(code).toString()}`;
    let mailRequest = getMailOptions(payload.email, payload.given_name, link);     

    return getTransport().sendMail(mailRequest, (error) => {
      if (error) {
        console.error(error)
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send("An Error occured\nNo email sent!");
      } else {       
        return res.status(OK).send({ message: "Email Sent", sentEmail: true });
      }
    });
  }

  const authToken = generateToken(payload.email, currentUser);

  if (!currentUser.isActive) {     
    await userModel.updateOne(
      { _id: payload.email },
      { isActive: true, accessToken: authToken }
    );
  }

  //Login exisiting users
  res.set(authToken);   
  return res
    .status(OK)
    .send({ message: "Sucess", authToken, sentEmail: false });
});

app.get("/verify-token", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    res.status(UNAUTHORIZED).send("Invalid authentication credentials");
    return;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (e) {
    res.status(UNAUTHORIZED).send("Invalid authentication credentials");
    return;
  }

  if (
    !decodedToken.hasOwnProperty("code") ||
    !decodedToken.hasOwnProperty("expirationDate")
  ) {
    res.status(UNAUTHORIZED).send("Invalid authentication credentials.");
    return;
  }

  const { code, expirationDate } = decodedToken;

  if (expirationDate < new Date()) {
    res.status(UNAUTHORIZED).send("Token has expired.");
    return;
  }

  const { tokens } = await oauth2Client.getToken(code);

  const id_token = tokens.id_token;
  oauth2Client.setCredentials(tokens);

  const payload = await verify(id_token).catch(console.error);
  let currentUser = await userModel.findById(payload.email);

  if (!currentUser) {
    return res.redirect("/login");
  }

  if (!currentUser.isActive) {
    await userModel.updateOne({ _id: email }, { isActive: true });
  }

  const authToken = generateToken(email, currentUser);
  res.set("Authorization-Token", authToken);
  return res.status(OK).send({ message: "Sucess", authToken });
});

app.get("/login", (req, res) => {
  const authToken = req.headers["Authorization-Token"];
  if (authToken) {
    return res.redirect(OK, "/dashboard");
  }
  return res.redirect(authorizationUrl);
});

app.use("/api/v1.0/users", userroutes);
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
