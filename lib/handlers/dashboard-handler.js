const { userModel } = require("../models/user-model");
const resources = require("../utils/roadmap-content.json");
const { UNAUTHORIZED, TWO, ONE, OK } = require("../utils/status-codes");

exports.getUserDashboard = async (request, response) => {
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
        return response.status(BAD_REQUEST).send('User has not selected career path');
    }
    
    //Get resource for the user's current skill level
    let resource = resources.find(path => path.careerPath.toLowerCase() == careerPath.toLowerCase())
        ?.levels[0][user?.currentSkillLevel];      

    //Extract completed projectIds
    const usersCompletedProjectIds = user.completedProjects.map(x => x.projectId);

    resource = resource.map(x => {
        x.isCompleted = usersCompletedProjectIds.includes(x?.projectId);
        return x;
    })

    let userInfo = {
        currentSkillLevel: {
            title: user.currentSkillLevel
        },
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
