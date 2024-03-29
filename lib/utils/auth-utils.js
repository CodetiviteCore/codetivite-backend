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

exports.generateToken = (email, profile = null, isNewUser = false) => {
  const expirationDate = new Date();
  const expirationTime = 60;
  expirationDate.setMinutes(new Date().getMinutes() + expirationTime);
  return jwt.sign(
    { email, profile: profile, expirationDate, isNewUser },
    process.env.JWT_SECRET_KEY
  );
};

exports.getMailOptions = (email, firstname, link) => {
  let body = `
  <h3>Hey ${firstname ?? "!"}</h3>
  <p>Welcome to Codetivite! We are super pumped to have you</p>
  <p><a href="${link}">Click this </a> to continue to the Codetivite platform:</p>  
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

exports.getContactUsMailOptions = (email, firstname, lastname, message) => {
  let body = `
  <h3>Hey Guys!</h3>
  <p>My name is ${firstname + " " + lastname}</p>
  <p>My email is ${email}</p>  
  <p>Message: ${message}</p>
  <br />  
  <p>The Codetivite Team!</p>`;

  return {
    body,
    subject: "Customer Inquiry",
    to: process.env.EMAIL_ADDRESS,
    html: body,
    from: process.env.EMAIL_ADDRESS,
  };
};