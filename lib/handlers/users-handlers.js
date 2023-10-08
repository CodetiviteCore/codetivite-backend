const createHttpError = require("http-errors");
const { userModel } = require("../models/user-model");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  ONE,
  MINUSONE,
} = require("../utils/status-codes");
const { careers, skillLevels, isTemporaryEmail } = require("../utils/helper-utils");
const { getContactUsMailOptions, getTransport } = require("../utils/auth-utils");

exports.addToMailList = async (request, response, next) => {
  try {
    const { firstName, email } = request.body;

    if (!email)
      throw createHttpError(BAD_REQUEST, "Invalid Request Body");

    if (isTemporaryEmail(email)) {
      return response.status(BAD_REQUEST).send({ message: "Invalid email provider" })
    }

    let currentUser = await userModel.findById(email);

    if (!currentUser) {
      currentUser = new userModel({
        _id: email,
        firstName: firstName ?? email,
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

  if (isTemporaryEmail(email)) {
    return response.status(BAD_REQUEST).send({ message: "Invalid email provider" })
  }

  let currentUser = new userModel({
    _id: email,
    firstName: firstName,
    userName: email,
  });
  currentUser = await currentUser.save();

  response.status(OK).send(currentUser);
};

exports.getUser = async (request, response, next) => {
  const { _id } = request.user;

  let user = null;
  try {
    user = await userModel.findById(_id);
    if (!user) {
      return response.status(BAD_REQUEST).send({ message: 'Invalid user Id' });
    }
  } catch (error) {
    next(error);
  }

  response.status(OK).send({ message: "success", user });
};

exports.renderCareerPaths = async (_, response) => {
  response.status(OK).send(careers);
};

exports.updateCareerPath = async (request, response, next) => {
  const { _id } = request.user;
  const { careerPath, firstName, lastName } = request.query;

  if (!careerPath || !firstName || !lastName) {
    return response.status(BAD_REQUEST).send({ message: "Invalid Request Parameters" })
  }

  try {
    await userModel.findOneAndUpdate({ _id, }, { careerPath, firstName , lastName });
  } catch (error) {
    next(error);
  }

  response.status(OK).send({ message: "success" });
};

exports.updateSkillLevel = async (request, response, next) => {
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
  let nextLevelIndex = 0;
  try {
    nextLevelIndex = skillLevels.indexOf(currentSkillLevel) + ONE;

    await userModel.findOneAndUpdate({ _id, }, { currentSkillLevel: skillLevels[nextLevelIndex] });
  } catch (error) {
    next();
  }


  response.status(OK).send({ message: "success", level: skillLevels[nextLevelIndex] });
};

exports.contactUs = async (request, response, next) => {
  const { firstName, lastName, email, message } = request.body;

  if (isTemporaryEmail(email)) {
    return response.status(BAD_REQUEST).send({ message: "Invalid email provider" })
  }

  let currentUser = await userModel.findById(email);

  if (!currentUser) {
    currentUser = new userModel({
      _id: email,
      firstName,
      lastName,
      userName: email,
    });
    currentUser = await currentUser.save();
  }

  let mailRequest = getContactUsMailOptions(email, firstName, lastname, message);

  getTransport().sendMail(mailRequest, (error) => {
    if (error) {
      console.error(error);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send("An Error occured\nNo email sent!");
    } else {
      return res.status(OK).send({ message: "Email Sent", sentEmail: true });
    }
  });

  return response.status(OK).send({ message: "Inquiry sent" });
}