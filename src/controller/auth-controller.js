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

exports.generateToken = (email, name) => {
  const expirationDate = new Date();
  const expiration_time = 60;
  expirationDate.setMinutes(new Date().getMinutes() + expiration_time);
  return jwt.sign({ email, name, expirationDate }, process.env.JWT_SECRET_KEY);
};

exports.getMailOptions = (email, link) => {
  let body = `
  <h2>Hey ${email}! Welcome to Codetivite</h2>
  <p>Click this to verify your account: </p>
  <p>${link}</p>
  <p>Please note that for added security this link becomes invalid after 45 minutes</p>
  <p>If you did not make this request, simply ignore this mail</p><br />
  <p>Stay Jiggy</p>
  <p>Codetivite Team</p>`;

  return {
    body,
    subject: "Welocme ToCodetivite",
    to: email,
    html: body,
    from: process.env.EMAIL_ADDRESS,
  };
};
