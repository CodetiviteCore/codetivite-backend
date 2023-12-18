const { UNAUTHORIZED, NOT_FOUND, BAD_REQUEST, MINUSONE } = require("../utils/status-codes");
const resources = require("../utils/roadmap-content.json");
const { userModel } = require("../models/user-model");
const { skillLevels } = require("../utils/helper-utils");

exports.restrictAccess = async (req, res, next) => {
  const {_id} = req.user;

  if(!_id) {
    return res.status(UNAUTHORIZED).send({message: "User is not authorized"});
  }

  const user = await userModel.findById(_id);

  if(!user) {
    return res.status(NOT_FOUND).send({message: "User does not exist"});
  }

  const { currentSkillLevel, careerPath } = user;

  if (!currentSkillLevel || !careerPath) {
    return res.status(NOT_FOUND).send({message: !careerPath ? "User has not selected a career path" : "User level not found"});
  }

  const { roadmap, level, skillLevel } = req.query;

  if (!roadmap || !(level || skillLevel)) {
    return res.status(BAD_REQUEST).send({message: 'Invalid roadmap'});
  }

  const requestedLevel = level || skillLevel;

  const currentLevelId = skillLevels.indexOf(currentSkillLevel);
  const levelId = skillLevels.indexOf(requestedLevel.toString().toLowerCase());

  if(currentLevelId == MINUSONE || levelId == MINUSONE) {
    return res.status(BAD_REQUEST).send({message: "Level doesn't exist"})
  }

  try {
    if (careerPath.toLowerCase() === roadmap.toString().toLowerCase()) {
      if (levelId <= currentLevelId) {
        next();
      } else {
        return res.status(UNAUTHORIZED).send({message: "User is not authorized to this level"});
      }
    } else {
      return res.status(UNAUTHORIZED).send({message: "User is not authorized to this career path"});
    }
  } catch (error) {
    next(error);
  }
}