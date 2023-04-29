const { OK, INTERNAL_SERVER_ERROR, ONE, ZERO } = require("../utils/status-codes");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const client_secret = require("../../client_secret.json");
const { userModel } = require("../models/user-model");
const {
  generateToken,
  getMailOptions,
  getTransport,
} = require("../utils/auth-utils");
const { badges } = require("../utils/helper-utils");

const oauth2Client = new google.auth.OAuth2(
  client_secret.web.client_id,
  client_secret.web.client_secret,
  client_secret.web.redirect_uris[ZERO]
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

exports.authenticate = async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);

  const id_token = tokens.id_token;
  oauth2Client.setCredentials(tokens);
  const payload = await verify(id_token).catch(console.error);

  let currentUser = await userModel.findById(payload.email);
  let authToken = generateToken(payload.email, currentUser);

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
        { lastName: payload.family_name, badges: [badges[ZERO]] }
      );
    }

    authToken = generateToken(payload.email, currentUser);
    const link = `${process.env.FE_HOST}?token=${authToken}`;
    let mailRequest = getMailOptions(payload.email, payload.given_name, link);

    return getTransport().sendMail(mailRequest, (error) => {
      if (error) {
        console.error(error);
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send("An Error occured\nNo email sent!");
      } else {
        return res.status(OK).send({ message: "Email Sent", sentEmail: true });
      }
    });
  }

  //Login exisiting users
  res.set(authToken);
  return res
    .status(OK)
    .send({ message: "Success", authToken, sentEmail: false });
};

exports.login = (_, res) => {
  return res.redirect(authorizationUrl);
};
