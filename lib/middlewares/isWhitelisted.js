const { whitelistModel } = require("../models/whitelist-model");
const { BAD_REQUEST, OK } = require("../utils/status-codes");

exports.isWhitelisted = async (request, response, next) => {
    const { _id } = request.user;
    let _email = null;
    try {
        _email = await whitelistModel.findById(_id);
    } catch (error) {
        next(error);
    }
    if (!_email) {
        return response.status(BAD_REQUEST).send({ message: 'User is not authorized to access data' });
    }
    next();
};