const { OK, INTERNAL_SERVER_ERROR } = require("../utils/status-codes");

exports.errorHandler = (err, _, res, next) => {
    res.status(err.status || INTERNAL_SERVER_ERROR);
    res.json({
        error: {
            message: err.message,
        },
    });
};
