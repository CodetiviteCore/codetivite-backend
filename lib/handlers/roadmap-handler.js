const { resources } = require("../utils/roadmap-content");
const { OK } = require("../utils/status-codes");

exports.getRoadMap = (request, response) => {
  const { careerPath } = request.query;

  const resource = resources.find(
    (path) => path.careerpath.toLowerCase() == careerPath.toLowerCase()
  );

  response.status(OK).send({ message: "Success", resource });
};
