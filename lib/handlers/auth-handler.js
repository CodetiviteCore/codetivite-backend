const { OK, INTERNAL_SERVER_ERROR, ONE, ZERO, BAD_REQUEST, UNAUTHORIZED } = require("../utils/status-codes");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const client_secret = require("../../client_secret.json");
const { userModel } = require("../models/user-model");
const {
  generateToken,
  getMailOptions,
  getTransport,
} = require("../utils/auth-utils");
const { badges, isTemporaryEmail } = require("../utils/helper-utils");
const HttpException = require("../utils/error");

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

exports.authenticate = async (req, res, next) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);

  const id_token = tokens.id_token;
  oauth2Client.setCredentials(tokens);
  let payload = null;
  try {
    payload = await verify(id_token);
  } catch (error) {
    throw new HttpException(BAD_REQUEST, "Invalid code")
  }

  let currentUser = null;
  let authToken = null;

  //Send a mail for non-existent or inactive users
  try {
    currentUser = await userModel.findById(payload.email);
    authToken = payload.email && currentUser ? generateToken(payload.email, currentUser) : null;

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
  } catch (error) {
    next(error);
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

exports.loginWithMagicLink = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(BAD_REQUEST).send({ message: "Invalid Email" })
  }

  const user = await userModel.findById(payload.email);

  if (!user) {
    return res.status(BAD_REQUEST).send({ message: "No account exists with this email" });
  }

  const authToken = generateToken(email, user);
  const link = `${process.env.FE_HOST}?token=${authToken}`;
  let mailRequest = getMailOptions(email, user.firstName, link);

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

exports.verifyMagicLink = async () => {
  const { token } = req.query;

  if (!token) {
    res.status(BAD_REQUEST).send("Invalid user token");
    return;
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return res.status(UNAUTHORIZED).send("Invalid authentication credentials");
  }

  if (
    !decodedToken ||
    !decodedToken.hasOwnProperty("email") ||
    !decodedToken.hasOwnProperty("expirationDate")
  ) {
    return res.status(UNAUTHORIZED).send("Invalid authentication credentials");
  }

  const { expirationDate } = decodedToken;
  if (expirationDate < new Date()) {
    res.status(UNAUTHORIZED).send("Token has expired.");
    return;
  }

  //Login exisiting users
  res.set(authToken);
  return res
    .status(OK)
    .send({ message: "Success", authToken, sentEmail: false });
}

exports.loginWithMagicLink = async (request, response, next) => {
  const { email } = request.body;

  if (!email || isTemporaryEmail(email)) {
    return response.status(BAD_REQUEST).send({ message: "Invalid Email" })
  }

  try {
    let user = await userModel.findById(email);

    //If we have an exisiting user
    if (user && user.lastName) {
      const authToken = generateToken(email, user);

      const link = `${process.env.FE_HOST}?token=${authToken}`;

      const mailRequest = getMailOptions(email, user.firstName, link, isNewUser = false);

      await getTransport().sendMail(mailRequest);
      return response.status(OK).send({ message: "Email Sent", sentEmail: true });
    }
  } catch (error) {
    console.error(error);
    return response.status(INTERNAL_SERVER_ERROR).send("An Error occurred\nNo email sent!");
  }

  try {
    if (!user) {
      user = new userModel({
        _id: email,
        firstName: email,
        lastName: " ",
        userName: email,
        isActive: false,
        badgesEarned: [badges[ZERO]]
      });

      await user.save();
    } else {
      user.badgesEarned = [badges[ZERO]];

      await user.save();
    }
  } catch (error) {
    console.error(error);
    return response.status(INTERNAL_SERVER_ERROR).send("An Error occurred\n User details not saved!");
  }

  const authToken = generateToken(email, user, true);

  const link = `${process.env.FE_HOST}?token=${authToken}`;

  let mailRequest = getMailOptions(email, firstName = null, link, isNewUser = false);

  try {
    await getTransport().sendMail(mailRequest);
    return response.status(OK).send({ message: "Email Sent", sentEmail: true });
  } catch (error) {
    console.error(error);
    return response.status(INTERNAL_SERVER_ERROR).send("An Error occurred\nNo email sent!");
  }
}