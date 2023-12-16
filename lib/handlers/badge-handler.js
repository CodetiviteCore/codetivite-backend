const resources = require("../utils/roadmap-content.json");
const { badges } = require("../utils/helper-utils");
const {
  UNAUTHORIZED,
  BAD_REQUEST,
  OK,
  INTERNAL_SERVER_ERROR,
  ONE,
  ZERO,
} = require("../utils/status-codes");

exports.updateUserBadge = async (request, response) => {
  try {
    const email = request?.user?._id;
    if (!email) {
      return response
        .status(UNAUTHORIZED)
        .send({ message: "Unauthorized User" });
    }

    const { badgeId } = request.query;

    if(!badgeId) {
      res.status(BAD_REQUEST).send({message: 'Invalid request'});
    }

    if (!badges.includes(badgeId?.toString().toLowerCase())) {
      return response.status(BAD_REQUEST).send({ message: "Invalid badge Id" });
    }

    if (request.user.badgesEarned?.includes(badgeId)) {
      return response
        .status(BAD_REQUEST)
        .send({ message: "User already has this badge" });
    }

    request.user.badgesEarned.push(badgeId);
    await request.user.save();

    return response.status(OK).send({ message: "Updated User Badge Info" });
  } catch (error) {
    next(error);
  }
};

exports.awardBadge = async (req, res, next) => {
  try {
    const email = req.user._id;

    if (!email) {
      return res.status(UNAUTHORIZED).send("Unauthorized user");
    }

    const skillLevel = req.user.currentSkillLevel;

    const roadmap = req.user.careerPath;

    const completedProjects = req.user.completedProjects.filter((project) => {
      return (
        project.skillLevel === skillLevel &&
        project.roadmap === roadmap &&
        project.isCompleted
      );
    });

    if (!completedProjects || completedProjects.length === ZERO) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(!completedProjects ? "Error in retrieving user's projects" : "User has not done any project");
    }

    const totalProjectsInLevel = resources.find(
      (path) => path.careerPath.toLowerCase() === roadmap.toLowerCase()
    )?.levels;

    if (!totalProjectsInLevel) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send("Error in retrieving projects");
    }

    const lengthOfTotalProjectsInLevel = totalProjectsInLevel.find(
      (level) => level[skillLevel]
        )?.[skillLevel]?.length;


    if (completedProjects.length !== lengthOfTotalProjectsInLevel) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "User is yet to finish projects in this level" });
    }

    // Code to check if user has completed final project would be added here

    const currentBadge = req.user.badgesEarned[user.badgesEarned.length - ONE];

    let newBadge = getNextBadge(badges, currentBadge);

    if (newBadge === null) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "User has earned all badges" });
    }

    req.user.badgesEarned.push(badges[newBadge]);

    await req.user.save();

    return res.status(OK).send({ message: "New badge awarded", newBadge });
  } catch (error) {
    next(error);
  }
};

const getNextBadge = (badgesArray, recentBadge) => {
    let badgeId = badgesArray.indexOf(recentBadge)

    if(badgeId == badgesArray.length - ONE) {
        return null;
    }
    badgeId += ONE;

    return badgesArray[badgeId];
}