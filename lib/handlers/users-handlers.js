const createHttpError = require("http-errors");
const { userModel } = require("../models/user-model");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  ONE,
  MINUSONE,
} = require("../utils/status-codes");
const { careers, skillLevels } = require("../utils/helper-utils");

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

exports.getUser = async (request, response) => {
  const { _id } = request.user;

  const user = await userModel.findById(_id);
  if (!user) {
    return response.status(BAD_REQUEST).send({ message: 'Invalid user Id' });
  }

  response.status(OK).send({ message: "success", user });
};

exports.renderCareerPaths = async (_, response) => {
  response.status(OK).send(careers);
};

exports.updateCareerPath = async (request, response) => {
  const { _id } = request.user;
  const { careerPath } = request.query;

  await userModel.findOneAndUpdate({ _id, }, { careerPath, });
  response.status(OK).send({ message: "success" });
};

exports.updateSkillLevel = async (request, response) => {
  const { _id } = request.user;

  let currentSkillLevel = request.user?.currentSkillLevel;
  if (!currentSkillLevel) {
    return response.status(BAD_REQUEST).send({ message: 'Invalid skill level' });
  }

  const currentSkillLevelIndex = skillLevels.indexOf(currentSkillLevel.toString().toLowercase());
  if (currentSkillLevelIndex == MINUSONE) {
    return response.status(INTERNAL_SERVER_ERROR).send({ message: 'Skill level not found' });
  }

  if (currentSkillLevel === skillLevels.length - ONE) {
    return response.status(BAD_REQUEST).send({ message: 'User is at highest skill level' });
  }

  let nextLevelIndex = skillLevels.indexOf(currentSkillLevel) + ONE;


  await userModel.findOneAndUpdate({ _id, }, { currentSkillLevel: skillLevels[nextLevelIndex] });
  response.status(OK).send({ message: "success", level: skillLevels[nextLevelIndex] });
};
