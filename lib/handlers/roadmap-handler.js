const { resources } = require("../utils/roadmap-content");
const { OK, ONE, BAD_REQUEST, UNAUTHORIZED, TWO } = require("../utils/status-codes");
const { userModel } = require('../models/user-model');
const { salaryPerSkillLevel } = require("../utils/helper-utils");

exports.getRoadMap = async (request, response) => {
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
    (path) => path.careerpath.toLowerCase() == careerPath.toLowerCase()
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
