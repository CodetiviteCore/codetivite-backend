const e = require("express");
const { userBadgeModel } = require("../models/user-badge-model");
const { INTERNAL_SERVER_ERROR, CREATED, UNAUTHORIZED, BAD_REQUEST, OK } = require("../utils/status-codes");

exports.updateUserBadge = async (request, response) => {
    const email = request?.user?._id;
    if (!email) {
        return response.status(UNAUTHORIZED).send('Unauthorized User');
    }

    const { badgeId } = request.query;
    if (!(await projectModel.findById(badgeId))) {
        return response.status(BAD_REQUEST).send('Invalid Badge Id');
    }

    if (request.user.badgesEarned?.includes(badgeId)){
        return response.status(BAD_REQUEST).send('User already has this badge');
    }

    request.user.badgesEarned.push(badgeId);
    await request.user.save();

    return response.status(OK).send({ message: "Updated User Badge Info" });
}