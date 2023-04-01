const { UNAUTHORIZED } = require("../utility/status-codes");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userModel = require("../models/user-model");

exports.authenticateMiddleware = async function (req, res, next) {
  const splittedAuthHeader = req.headers.authorization?.split(" ");

  if (!splittedAuthHeader) {
    return res.status(UNAUTHORIZED).send("No authorization token specified in headers");
  }

  if (splittedAuthHeader.length != 2) {
    return res.status(UNAUTHORIZED).send("Invalid authorization header specified.\nIt must be a bearer auth token");
  }
  
  if (!(await userModel.findById(payload.email))?.isActive) {
    await userModel.updateOne(
      { _id: payload.email },
      { isActive: true, accessToken: authToken }
    );
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    res.status(UNAUTHORIZED).send("Invalid authorization token");
  }

  next();
};
