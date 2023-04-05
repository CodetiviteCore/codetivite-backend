const { resources } = require("../utils/roadmap-content");
const { OK, NOT_FOUND } = require("../utils/status-codes");
const userModel = require('../models/user-model');

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
      title: user.currentSkillLevel.title,
      level: user.currentSkillLevel.level,
      percentage: user.currentSkillLevel.percentage,
      note: user.currentSkillLevel.note
    },
    avarageSalary: {
      title: user.averageSalary.title,
      amount: user.averageSalary.amount,
      percentage: user.averageSalary.percentage,
      note: user.averageSalary.note
    },
    badgeEarned: {
      title: user.badgesEarned.title,
      level: user.badgesEarned.level,
      percentage: user.badgesEarned.percentage,
      note: user.badgesEarned.note
    },
    completedProjects: {
      title: user.completedProjects.title,
      level: user.completedProjects.level,
      percentage: user.completedProjects.percentage,
      note: user.completedProjects.note
    }
  }

  response.status(OK).send({ message: "Success", resource, userInfo });
};
