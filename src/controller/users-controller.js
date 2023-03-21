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

// create a route that returns an array of strings ---which are the specific careerPaths
exports.renderCareerPaths = async (request, response) => {
  let careers = {
    "frontend-dev" : 1,
    "backend-dev" : 2,
    "solidity-dev" : 3,
    "blockchain-dev" : 4,
    "defi-dev" : 5,
    "uiux" : 6,
    "technical-wri" : 7,
    "full-stack-dev" : 8,
    "product-manager" : 9,
    "community-manager" : 10,
    "rust-dev" : 11,
    "devops" : 12,
    "graphic-des" : 13,
    "smart-contract-dev" : 14,
  }

  response.status(OK).send(careers);
}

exports.updateCareerPath = async (request, response) => {
  // const email = request.user.email;
  const email = "canicecodes@gmail.com";

  const name = request.query.name;

  await userModel.findOneAndUpdate(
    {
      _id: email,
    },
    {
      careerPath: name,
    }
  );

  response.status(OK).send({ message: "success" });
};
