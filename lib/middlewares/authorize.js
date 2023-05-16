const { UNAUTHORIZED, INTERNAL_SERVER_ERROR, TWO, ONE, ZERO, BEARER } = require("../utils/status-codes");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user-model");

exports.authenticateMiddleware = async function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(UNAUTHORIZED).send("No authorization token specified in headers");
  }

  const splittedAuthHeader = req.headers.authorization?.split(" ");

  if (splittedAuthHeader.length != TWO || splittedAuthHeader[ZERO].toString().toLowerCase() != BEARER) {
    return res.status(UNAUTHORIZED).send("Invalid authorization header specified.\nIt must be a bearer auth token");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(splittedAuthHeader[ONE], JWT_SECRET_KEY);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).send(error.message);
    return;
  }

  if (
    !decodedToken.hasOwnProperty("email") ||
    !decodedToken.hasOwnProperty("profile") ||
    !decodedToken.hasOwnProperty("expirationDate")
  ) {
    res.status(UNAUTHORIZED).send("Invalid authentication credentials.");
    return;
  }

  const { email, expirationDate } = decodedToken;

  if (!email || !expirationDate){
    return res.status(UNAUTHORIZED).send("Invalid data sent"); 
  }

  if (expirationDate < new Date()) {
    return res.status(UNAUTHORIZED).send("Token has expired.");    
  }

  let user = await userModel.findById(email);

  if (!user) {
    return res.status(UNAUTHORIZED).send("Invalid authentication credentials.");
  }

  if (!user.isActive) {
    await userModel.updateOne(
      { _id: email },
      { isActive: true, accessToken: splittedAuthHeader[ONE] }
    );
  }

  req.user = user;

  next();
};
