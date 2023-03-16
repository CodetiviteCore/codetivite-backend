const { UNAUTHORIZED } = require("../utility/status-codes");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = function (req, res, next) {
  const splittedAuthHeader = req.headers.authorization?.split(" ");

  if (!splittedAuthHeader) {
    return res.status(UNAUTHORIZED).send("No authorization token specified in headers");
  }

  if (splittedAuthHeader.length != 2) {
    return res.status(UNAUTHORIZED).send("Invalid authorization header specified.\nIt must be a bearer auth token");
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    res.status(UNAUTHORIZED).send("Invalid authorization token");
  }

  next();
};
