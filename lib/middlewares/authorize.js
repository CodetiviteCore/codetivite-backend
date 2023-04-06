const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require("../utils/status-codes");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

exports.authenticateMiddleware = async function (req, res, next) {
  const ONE = 1;
  const TWO = 2;

  const splittedAuthHeader = req.headers.authorization?.split(" ");

  // if (!splittedAuthHeader) {
  //   return res.status(UNAUTHORIZED).send("No authorization token specified in headers");
  // }

  if (splittedAuthHeader.length != TWO) {
    return res.status(UNAUTHORIZED).send("Invalid authorization header specified.\nIt must be a bearer auth token");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(splittedAuthHeader[ONE], JWT_SECRET_KEY);
  } catch(error) {
    res.status(INTERNAL_SERVER_ERROR).send(error.message);
    return;
  }

  if (
    !decodedToken.hasOwnProperty("email") ||
    !decodedToken.hasOwnProperty("profile") ||
    !decodedToken.hasOwnProperty("expirationDate")
  ) {
    res.status(401).send("Invalid authentication credentials.");
    return;
  }

  const { email, expirationDate } = decodedToken;
  if (expirationDate < new Date()) {
    res.status(401).send("Token has expired.");
    return;
  }

  let user = await userModel.findById(email);

  if (!user){
    res.status(401).send("Invalid authentication credentials.");
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
