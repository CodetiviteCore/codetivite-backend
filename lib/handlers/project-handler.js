const { projectModel } = require("../models/project-model");
const { careers, skillLevels } = require("../utils/helper-utils");
const {
    UNAUTHORIZED,
    OK,
    BAD_REQUEST,
    ONE } = require("../utils/status-codes");

exports.getProjectsDueForSyllabus = async (request, response) => {
    const email = request.user._id;
    if (!email) {
        return response.status(UNAUTHORIZED).send('Unauthorized User');
    }

    let { roadmap, skillLevel } = request.query;
    roadmap = roadmap.toString().toLowerCase();
    skillLevel = skillLevel.toString().toLowerCase();

    const projectsDue = await projectModel.find({ roadmap, skillLevel });
    return response.status(OK).send({ message: "Success", projectsDue })
}

exports.getProjectsCompleted = async (request, response) => {
    const email = request.user._id;
    if (!email) {
        return response.status(UNAUTHORIZED).send('Unauthorized User');
    }

    return response.status(OK).send(
        {
            message: "Success",
            projectsCompleted: request?.user?.completedProjects
        });
}

exports.updateSyllabusStatus = async (request, response) => {
    const email = request.user._id;
    if (!email) {
        return response.status(UNAUTHORIZED).send('Unauthorized User');
    };

    let { roadmap, skillLevel, projectId } = request.body;

    if (!roadmap || !skillLevel || !projectId) {
        return response.status(BAD_REQUEST).send('Invalid request body');
    };

    roadmap = roadmap.toString().toLowerCase();
    skillLevel = skillLevel.toString().toLowerCase();

    if (!careers.includes(roadmap)) {
        return response.status(BAD_REQUEST).send('Invalid career path Id');
    };

    if (!skillLevels.includes(skillLevel)) {
        return response.status(BAD_REQUEST).send('Invalid skill level Id');
    };

    const project = await projectModel.findById(projectId);
    if (!project) {
        return response.status(BAD_REQUEST).send('Invalid project Id');
    }

    const userProject = request.user.completedProjects?.find(x =>
        x.roadmap === roadmap &&
        x.skillLevel == skillLevel &&
        x.projectId.toString() === projectId);

    if (userProject) {
        return response.status(BAD_REQUEST).send({ message: 'Project already completed' });
    }

    request.user.completedProjects.push({
        roadmap,
        skillLevel,
        isCompleted: true,
        projectId
    });

    await request.user.save();
    project.completedCount += ONE;

    await project.save();
    return response.status(OK).send({ message: "Success" });
}
