const createHttpError = require("http-errors");
const path = require("path");
const { userModel } = require("../models/user-model");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} = require("../utils/status-codes");
const { careers } = require("../utils/helper-utils");

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

exports.createUser = async (request, response) => {
  const { email, firstName } = request.body;

  let currentUser = new userModel({
    _id: email,
    firstName: firstName,
    userName: email,
  });
  currentUser = await currentUser.save();

  response.status(OK).send(currentUser);
};

  exports.renderCareerPaths = async (_, response) => {
    response.status(OK).send(careers);
  };

exports.updateCareerPath = async (request, response) => {
  const { email } = request.user;
  const { careerPath } = request.query;

  await userModel.findOneAndUpdate(
    {
      _id: email,
    },
    {
      careerPath,
    }
  );

  response.status(OK).send({ message: "success" });
};
