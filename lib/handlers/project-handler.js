const { projectModel } = require("../models/project-model");
const { userProjectModel } = require("../models/user-project-model");
const { status, careers, skillLevels } = require("../utils/helper-utils");
const {
    UNAUTHORIZED,
    OK,
    BAD_REQUEST } = require("../utils/status-codes");

exports.getProjectsDueForSyllabus = (request, response) => {
    const email = request.user._id;
    if (!email) {
        return response.status(UNAUTHORIZED).send('Unauthorized User');
    }

    const { roadmap, skillLevel } = request.query;
    const projectsDue = projectModel.$where({ roadmap, skillLevel });

    return response.status(OK).send({ message: "Success", projectsDue })
}

exports.updateSyllabusStatus = async (request, response) => {
    const email = request.user._id;
    if (!email) {
        return response.status(UNAUTHORIZED).send('Unauthorized User');
    }

    const { roadmap, skillLevel, projectId } = request.query;

    if (!roadmap || !skillLevel || projectId) {
        return response.status(BAD_REQUEST).send('Invalid request body');
    }

    if (!careers.includes(roadmap)) {
        return response.status(BAD_REQUEST).send('Invalid career path Id');
    }

    if (!skillLevels.includes(skillLevel)) {
        return response.status(BAD_REQUEST).send('Invalid skill level Id');
    }

    if (! await projectModel.findById(projectId)) {
        return response.status(BAD_REQUEST).send('Invalid project Id');
    }

    roadmap = roadmap.ToString().ToLowerCase();
    skillLevel = skillLevel.ToString().ToLowerCase();

    const userProject = await request.user.completedProject.find(x =>
        x.roadmap === roadmap &&
        x.skillLevel == skillLevel &&
        x.projectId === projectId);

    if (!userProject) {
        request.user.completedProjects.push({
            roadmap,
            skillLevel,
            isCompleted: true,
            projectId
        });

        await request.user.save();
        return response.status(OK).send({ message: "Success" });
    }

    const index = await request.user.completedProject.findIndex(userProject);

    userProject.isCompleted = !userProject.isCompleted;
    request.user.completedProject[index] = userProject;

    request.user.save();
    return response.status(OK).send({ message: "Success" });
}
