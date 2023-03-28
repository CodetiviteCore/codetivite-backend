const { resources } = require("../utils/roadmap-content");

exports.getRoadMap = (careerPath) => {
  return resources.find(
    (path) => path.careerpath.toLowerCase() == careerPath.toLowerCase()
  );
};
