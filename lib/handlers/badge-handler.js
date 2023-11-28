const { userModel } = require("../models/user-model");
const resources = require('../utils/roadmap-content.json')
const { badges } = require("../utils/helper-utils");
const { UNAUTHORIZED, BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require("../utils/status-codes");

exports.updateUserBadge = async (request, response) => {
    try {
        const email = request?.user?._id;
        if (!email) {
            return response.status(UNAUTHORIZED).send({ message: 'Unauthorized User' });
        }

        const { badgeId } = request.query;

        if (!badges.includes(badgeId?.toString().toLowerCase())) {
            return response.status(BAD_REQUEST).send({ message: 'Invalid badge Id' });
        }

        if (request.user.badgesEarned?.includes(badgeId)) {
            return response.status(BAD_REQUEST).send({ message: 'User already has this badge' });
        }

        request.user.badgesEarned.push(badgeId);
        await request.user.save();

        return response.status(OK).send({ message: "Updated User Badge Info" });
    } catch (error) {
        next(error);
    }
}

exports.awardBadge = async (req, res, next) => {
    try {
        const email = req.user._id;

        if(!email) {
            return res.status(UNAUTHORIZED).send('Unauthorized user');
        } 

        const user = await userModel.findById(email)

        if(!user) {
            return res.status(UNAUTHORIZED).send('User not found');
        }

        const skillLevel = user.currentSkillLevel;

        const roadmap = user.careerPath; 

        const completedProjects = user.completedProjects.filter(project => {
            return project.skillLevel === skillLevel && project.roadmap === roadmap && project.isCompleted
        })

        const totalProjectsInLevel = resources.find(path => path.careerPath.toLowerCase() === roadmap.toLowerCase())?.levels[0][skillLevel]?.length;

        if(completedProjects.length !== totalProjectsInLevel) {
            return res.status(BAD_REQUEST).send({message: 'User is yet to finish projects in this level'})
        }

        const currentBadge = user.badgesEarned[user.badgesEarned.length - 1];

        let newBadge;

        if(badges.indexOf(currentBadge) == -1) {
            return res.status(BAD_REQUEST).send({message: 'User has earned all badges'})
        } else {
            newBadge = badges.indexOf(currentBadge) + 1;

            user.badgesEarned.push(badges[newBadge])

            await user.save()

            return res.status(OK).send({message: 'User has earned a new badge'})
        }

    } catch (error) {
        next(error);
    }
}