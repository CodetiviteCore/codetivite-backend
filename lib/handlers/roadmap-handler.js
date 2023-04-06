const { resources } = require("../utils/roadmap-content");
const { OK, NOT_FOUND } = require("../utils/status-codes");
const userModel = require('../models/user-model');
const { salaryPerSkillLevel } = require("../utils/amount-utils");

exports.getRoadMap = async (request, response) => {
  const { careerPath } = request.query;
  const { email } = request.user;

  const resource = resources.find(
    (path) => path.careerpath.toLowerCase() == careerPath.toLowerCase()
  );

  const user = await userModel.findById(email);

  if (!user) {
    response.status(NOT_FOUND).send('User not found');
  }

  let userInfo = {
    currentSkillLevel : {
      title: user.currentSkillLevel
    },
    avarageSalary: salaryPerSkillLevel[user.currentSkillLevel.toLowerCase()],
    badgeEarned: {
      numberofBadgesGotten: user.badgesEarned.length,
      mostRecentBadgeGotten: user.badgesEarned[user.badgesEarned.length - 1]
    },
    completedProjects: {
      numberOfProjectCompleted: user.completedProjects.length,
      percentageIncreaseSinceLastProjectCompletion: "0%"
    }
  }

  response.status(OK).send({ message: "Success", resource, userInfo });
};
