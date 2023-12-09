const { UNAUTHORIZED, ZERO, ONE } = require("../utils/status-codes");
const resources = require("../utils/roadmap-content.json")

exports.restrictRoadmapView = async (req, res, next) => {
  const { email } = req.user._id;
  
  if(!email) {
    return res.status(UNAUTHORIZED).send({message: "User is unauthorized"});
  }
  
  const completedProjects = req.user.completedProjects;
  
  if(completedProjects.length === ZERO) {
    next();
  }
  
  const completedCurrentLevel = completedProjects.filter(
    (project) => project.skillLevel.toLowerCase() === req.user.currentSkillLevel.toLowerCase() && project.isCompleted
  )
  
  const resourceInLevel = resources.find(resource => 
    resource.careerPath.toLowerCase() === req.user.careerPath.toLowerCase())
    ?.levels[ZERO][req.user.currentSkillLevel];
  
  if(completedCurrentLevel.length !== resourceInLevel.length) {
    return res.status(UNAUTHORIZED).send({message: "Level is not completed"});
  }
  
  next();
}

exports.restrictProjectView = async (req, res, next) => {
  const { completedProjects } = req.user.completedProjects;

  if(completedProjects.length === ZERO) {
    next();
  }

  const { projectId } = req.body;

  const currentIndex = completedProjects.findIndex(project => 
    project.projectId === projectId
  )

  if(
    currentIndex > ZERO &&
    !completedProjects[currentIndex - ONE].isCompleted
  ) {
    return res.status(UNAUTHORIZED).send({message: "User has not completed preceding project"});
  }

  next();
}