const { response } = require("express");
const createHttpError = require("http-errors");
const path = require("path");
const userModel = require("../models/user-model");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} = require("../utils/status-codes");

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
exports.renderCareerPaths = async (_, response) => {
  let careers = [
    {
      careerpath: "frontend",
      id: 1,
      img: "frontendImg"
    },
    {
      careerpath: "backend",
      id: 2,
      img: "backendImg"
    },
    {
      careerpath: "solidity",
      id: 3,
      img: "solidityImg"
    },
    {
      careerpath: "blockchain",
      id: 4,
      img: "blockchainImg"
    },
    {
      careerpath: "defi-dev",
      id: 5,
      img: "defi-devImg"
    },
    {
      careerpath: "product-design",
      id: 6,
      img: "product-designImg"
    },
    {
      careerpath: "technical-writing",
      id: 7,
      img: "technical-writingImg"
    },
    {
      careerpath: "full-stack-dev",
      id: 8,
      img: "full-stack-devImg"
    },
    {
      careerpath: "product-manager",
      id: 9,
      img: "product-managerImg"
    },
    {
      careerpath: "community-manager",
      id: 10,
      img: "community-managerImg"
    },
    {
      careerpath: "rust-dev",
      id: 11,
      img: "rust-devImg"
    },
    {
      careerpath: "devops",
      id: 12,
      img: "devopsImg"
    },
    {
      careerpath: "graphic-des",
      id: 13,
      img: "graphic-desImg"
    },
    {
      careerpath: "smart-contract-dev",
      id: 14,
      img: "smart-contract-devImg"
    }
  ]  

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
