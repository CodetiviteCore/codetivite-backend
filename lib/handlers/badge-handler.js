const { badges } = require("../utils/helper-utils");
const { UNAUTHORIZED, BAD_REQUEST, OK } = require("../utils/status-codes");

exports.updateUserBadge = async (request, response) => {
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
}