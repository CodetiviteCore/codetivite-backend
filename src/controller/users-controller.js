const { response } = require("express");
const createHttpError = require("http-errors");
const path = require("path");
const userModel = require("../models/user-model");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} = require("../utility/status-codes");

exports.addToMailList = async (request, response, next) => {
  try {
    const { firstName, email } = request.body;

    if (!firstName || !email)
      throw createHttpError(BAD_REQUEST, "Invalid Request Body");

    let currentUser = await userModel.findById(email);

    if (!currentUser) {
      currentUser = new userModel({
        _id: email,
        firstName,
        userName: email,
      });
      currentUser = await currentUser.save();
    }

    response.status(OK).json({
      firstname: currentUser.firstName,
      email: currentUser._id,
    });
  } catch (error) {
    next(createHttpError(INTERNAL_SERVER_ERROR, error));
  }
};

exports.newUser = async (request, response) => {
  const body = request.body;

  let email = body.email;
  let firstName = body.firstName;
  let currentUser = new userModel({
    _id: email,
    firstName: firstName,
    userName: email,
  });
  currentUser = await currentUser.save();

  response.send(currentUser);
};

exports.careerPath = async (request, response) => {
  const email = request.user.email;
  console.log("user email: " + email);

  const name = request.query.name;
  console.log("career-path: " + name);

  const user = await userModel.findOneAndUpdate(
    {
      _id: email,
    },
    {
      careerPath: name,
    },
    {}
  );

  await user.save();

  response.end();
};
