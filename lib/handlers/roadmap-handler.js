const { resources } = require("../utils/roadmap-content");

exports.getRoadMap = (request, response) => {
  const { careerPath } = request.query;

  const resource = resources.find(
    (path) => path.careerpath.toLowerCase() == careerPath.toLowerCase()
  );

  response.status(Ok).send({ message: "Success", resource });
};
