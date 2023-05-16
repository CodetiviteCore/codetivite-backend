const resources = require("../utils/roadmap-content.json");
const { OK, ONE, BAD_REQUEST, UNAUTHORIZED, TWO, ZERO, HUNDRED } = require("../utils/status-codes");
const { userModel } = require('../models/user-model');
const { salaryPerSkillLevel, skillLevels } = require("../utils/helper-utils");
const { roadmapModel } = require("../models/roadmap-model");
const { projectModel } = require("../models/project-model");

exports.getUserRoadMap = async (request, response) => {
  const email = request.user._id;

  if (!email) {
    return response.status(UNAUTHORIZED).send('Unauthorized User');
  }

  const user = await userModel.findById(email);

  if (!user) {
    return response.status(UNAUTHORIZED).send('User not found');
  }
  const careerPath = user.careerPath;

  if (careerPath.length < TWO) {
    return response.status(BAD_REQUEST).send('User has not selected careere path');
  }

  const resource = resources.find(
    (path) => path.careerPath.toLowerCase() == careerPath.toLowerCase()
  );

  let userInfo = {
    currentSkillLevel: {
      title: user.currentSkillLevel
    },
    avarageSalary: salaryPerSkillLevel[user.currentSkillLevel.toLowerCase()],
    badgeEarned: {
      numberofBadgesGotten: user.badgesEarned.length,
      mostRecentBadgeGotten: user.badgesEarned[user.badgesEarned.length - ONE]
    },
    completedProjects: {
      numberOfProjectCompleted: user.completedProjects.length,
      percentageIncreaseSinceLastProjectCompletion: "0%",
    }
  }

  response.status(OK).send({ message: "Success", resource, userInfo });
};

exports.getRoadMapById = async (request, response, next) => {
  const { id } = request.params;

  if (!id) {
    return response.status(BAD_REQUEST).send('Invalid Id');
  }

  let resource;

  try {
    resource = await roadmapModel.findById(id.toString().trim());

    if (!resource) {
      return response.status(BAD_REQUEST).send('Resource not found');
    }
  } catch (error) {
    next(error);
  }

  return response.status(OK).send({ message: "Success", resource });
};


exports.getRoadMap = async (request, response, next) => {
  const { careerPath } = request.query;

  let resource;

  try {
    if (careerPath) {
      resource = resources.find(
        (path) => path.careerPath.toLowerCase() == careerPath.toLowerCase()
      );
    }

    if (resource) {
      return response.status(OK).send({ message: "Success", resource })
    }
  } catch (error) {
    next(error);
  }

  return response.status(OK).send({ message: "Success", resource });
};

exports.getRoadMapIds = async (_, response) =>
  response.status(OK).send({ message: "Success", resource: await roadmapModel.find({}) });

exports.getUserRoadMapProgressInPercent = async (request, response, next) => {
  const email = request.user._id;
  if (!email) {
    return response.status(UNAUTHORIZED).send('Unauthorized User');
  }

  let { roadmap, skillLevel, projectId } = request.query;

  if (!roadmap || !skillLevel) {
    response.status(BAD_REQUEST).send({ message: "Invalid request parameter" });
  }

  let progress = 0;
  let totalUserCount = 0;

  try {
    roadmap = roadmap.toString().toLowerCase();
    skillLevel = skillLevel.toString().toLowerCase();

    const totalProjectCount = await projectModel.count({ roadmap, skillLevel });

    const userProjectCount = await request.user.completedProjects?.filter(x =>
      x.roadmap === roadmap &&
      x.skillLevel == skillLevel && x.isCompleted)?.length;

    const project = await projectModel.findById(projectId);
    totalUserCount = !project ? ZERO : project.completedCount;

    if (userProjectCount < ONE || totalProjectCount < ONE) {
      return response.status(OK).send({ message: "Success", progress: ZERO, totalUserCount });
    }

    progress = (userProjectCount / totalProjectCount) * HUNDRED;
  } catch (error) {
    next(error);
  }

  return response.status(OK).send({ message: "Success", progress, totalUserCount });
}

exports.getSkillLevel = () => skillLevels;
