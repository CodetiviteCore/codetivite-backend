const { resourceUrls: resources } = require("../utils/roadmap-content");
const { OK, ONE, BAD_REQUEST, UNAUTHORIZED, TWO, ZERO, HUNDRED } = require("../utils/status-codes");
const { userModel } = require('../models/user-model');
const { salaryPerSkillLevel } = require("../utils/helper-utils");
const { roadmapModel } = require("../models/roadmap-model");
const { request } = require("http");
const { response } = require("express");
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
      mostRecentBadgeGotten: user.badgesEarned[user.badgesEarned.length - ONE]?.title
    },
    completedProjects: {
      numberOfProjectCompleted: user.completedProjects.length,
      percentageIncreaseSinceLastProjectCompletion: "0%"
    }
  }

  response.status(OK).send({ message: "Success", resource, userInfo });
};

exports.getRoadMapById = async (request, response) => {
  const { id } = request.params;

  if (!id) {
    return response.status(BAD_REQUEST).send('Invalid Id');
  }

  const resource = await roadmapModel.findById(id);

  if (!resource) {
    return response.status(BAD_REQUEST).send('Resource not found');
  }

  return response.status(OK).send({ message: "Success", resource });
};


exports.getRoadMap = async (request, response) => {
  const { careerPath } = request.query;

  let resource;

  if (careerPath) {
    resource = resources.find(
      (path) => path.careerPath.toLowerCase() == careerPath.toLowerCase()
    );
  }

  if (resource) {
    return response.status(OK).send({ message: "Success", resource })
  }

  return response.status(OK).send({ message: "Success", resources });
};

exports.getRoadMapIds = async (_, response) =>
  response.status(OK).send({ message: "Success", resource: await roadmapModel.find({}) });

exports.getUserRoadMapProgressInPercent = async (request, response) => {
  const email = request.user._id;
  if (!email) {
    return response.status(UNAUTHORIZED).send('Unauthorized User');
  }

  const { roadmap, skillLevel } = request.query;

  if (!roadmap || !skillLevel) {
    response.status(BAD_REQUEST).send({ message: "Invalid request parameter" });
  }

  roadmap = roadmap.ToString().ToLowerCase();
  skillLevel = skillLevel.ToString().ToLowerCase();

  const totalProjectCount = await projectModel.count({ roadmap, skillLevel });

  var userProjectCount = await request.user.completedProject.filter(x =>
    x.roadmap === roadmap &&
    x.skillLevel == skillLevel && isCompleted)?.length;

  // var totalUserCount = userModel.find({
  // })?.filter(x =>
  //   x.skillLevel == skillLevel.toLowerCase().trim() &&
  //   x.roadmap == roadmaptoLowerCase().trim() && x.status == skillLevels[ONE])?.length;

  if (userProjectCount < ONE || totalProjectCount < ONE) {
    return response.status(OK).send({ message: "Success", progress: ZERO });
    // return response.status(OK).send({ message: "Success", progress: ZERO, totalUserCount });

  }

  const progress = (userProjectCount / totalProjectCount) * HUNDRED;
  return response.status(OK).send({ message: "Success", progress });
  //return response.status(OK).send({ message: "Success", progress, totalUserCount });

}