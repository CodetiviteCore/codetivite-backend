const { OK } = require("../utils/status-codes");

exports.healthCheck = async (request, response, next) => {
    return response.status(OK).send({ message: "Server is alive!" })
}
