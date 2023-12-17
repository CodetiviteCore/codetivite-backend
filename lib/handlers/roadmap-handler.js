const resources = require("../utils/roadmap-content.json");
const { OK, ONE, BAD_REQUEST, UNAUTHORIZED, TWO, ZERO, HUNDRED } = require("../utils/status-codes");
const { userModel } = require('../models/user-model');
const { salaryPerSkillLevel, skillLevels, levelDescriptions } = require("../utils/helper-utils");
const { roadmapModel } = require("../models/roadmap-model");
const { projectModel } = require("../models/project-model");
const ObjectId = require('mongodb').ObjectId;

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

  const careerPathData = resources.find(path => path.careerPath.toLowerCase() == careerPath.toLowerCase());
  const levels = careerPathData?.levels[ZERO];

  const levelAndDescriptions = Object.keys(levels).filter(key => levels[key].length > ZERO).map(level => {
    return {
      roadmap: level,
      roadmapId: level,
      description: levelDescriptions[level]
    }
  });

  //Get resource for the user's current skill level
  let resource = levels[user?.currentSkillLevel];

  //Extract completed projectIds
  const usersCompletedProjectIds = user.completedProjects.map(x => x.projectId.toString().toLowerCase());

  resource = resource.map(x => {
    x.isCompleted = usersCompletedProjectIds.includes(x?.projectId.toString().toLowerCase());
    return x;
  })

  //On click of a roadmap level, get content for that road - when the reoadmad name and level is sent retrieve data 

  let userInfo = {
    currentSkillLevel: {
      title: user.currentSkillLevel,
      careerPath
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

  response.status(OK).send({ message: "Success", resource, userInfo, levelAndDescriptions });
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
  const { roadmap, level } = request.query;

  let resource;

  if (!roadmap) {
    return response.status(BAD_REQUEST).send('Invalid Career Path');
  }

  try {
    resource = resources.find(
      (path) => path.careerPath.toLowerCase() == roadmap.toLowerCase()
    );

    if (resource && level) {
      resource = resource?.levels[ZERO][level];
      return response.status(OK).send({ message: "Success", resource })
    }

    return response.status(OK).send({ message: "Success", resource });

  } catch (error) {
    next(error);
  }


};

exports.getRoadMapIds = async (_, response) =>
  response.status(OK).send({ message: "Success", resource: await roadmapModel.find({}) });

exports.getUserRoadMapProgressInPercent = async (request, response, next) => {
  const email = request.user._id;
  if (!email) {
    return response.status(UNAUTHORIZED).send('Unauthorized User');
  }

  let { roadmap, skillLevel } = request.query;

  if (!roadmap || !skillLevel) {
    response.status(BAD_REQUEST).send({ message: "Invalid request parameter" });
  }

  let progress = ZERO;

  try {
    roadmap = roadmap.toString().toLowerCase();
    skillLevel = skillLevel.toString().toLowerCase();

    const totalProjectCount = await projectModel.count({ roadmap, skillLevel });

    const userProjectCount = await request.user.completedProjects?.filter(x =>
      x.roadmap === roadmap &&
      x.skillLevel == skillLevel && x.isCompleted)?.length;


    if (userProjectCount < ONE || totalProjectCount < ONE) {
      return response.status(OK).send({ message: "Success", progress: ZERO });
    }

    progress = (userProjectCount / totalProjectCount) * HUNDRED;
    return response.status(OK).send({ message: "Success", progress, userProjectCount });

  } catch (error) {
    next(error);
  }
}

exports.getSkillLevel = () => skillLevels;
