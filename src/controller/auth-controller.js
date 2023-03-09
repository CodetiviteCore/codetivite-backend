const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.getTransport = () =>
  nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

exports.generateToken = (email, profile = null) => {
  const expirationDate = new Date();
  const expiration_time = 60;
  expirationDate.setMinutes(new Date().getMinutes() + expiration_time);
  return jwt.sign(
    { email, profile, expirationDate },
    process.env.JWT_SECRET_KEY
  );
};

exports.getMailOptions = (email, firstname, link) => {
  let body = `
  <h3>Hey ${firstname}!</h3>
  <p>Welcome to Codetivite! We are super pumped to have you</p>
  <p>Click this to continue to the contivite platform:</p>
  <p>${link}</p>
  <p>Please note that for added security this link becomes invalid after 45 minutes</p>
  <br />
  <p>Stay Jiggy!</p>
  <p>The Codetivite Team!</p>`;

  return {
    body,
    subject: "Welcome To Codetivite",
    to: email,
    html: body,
    from: process.env.EMAIL_ADDRESS,
  };
};
