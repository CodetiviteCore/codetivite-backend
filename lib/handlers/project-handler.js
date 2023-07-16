const { projectModel } = require("../models/project-model");
const { careers, skillLevels } = require("../utils/helper-utils");
const {
    UNAUTHORIZED,
    OK,
    BAD_REQUEST,
    ONE 
} = require("../utils/status-codes");

exports.getProjectsDueForSyllabus = async (request, response, next) => {
    const email = request.user._id;
    if (!email) {
        return response.status(UNAUTHORIZED).send('Unauthorized User');
    }

    try {
        let { roadmap, skillLevel } = request.query;
        roadmap = roadmap.toString().toLowerCase();
        skillLevel = skillLevel.toString().toLowerCase();

        const projectsDue = await projectModel.find({ roadmap, skillLevel });
        return response.status(OK).send({ message: "Success", projectsDue })
    } catch (error) {
        next(error);
    }
}

exports.getProjectsCompleted = async (request, response, next) => {
    try {
        const email = request.user._id;
        if (!email) {
            return response.status(UNAUTHORIZED).send('Unauthorized User');
        }
    } catch (error) {
        next(error)
    }

    return response.status(OK).send(
        {
            message: "Success",
            projectsCompleted: request?.user?.completedProjects
        });
}

exports.updateSyllabusStatus = async (request, response, next) => {
    const email = request.user._id;
    const { url } = request.body;
    if (!email || !url || !validateURL(url)) {
        return response.status(UNAUTHORIZED).send(!email ? 'Unauthorized User' : 'Invalid project URL');
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

    try {
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
    } catch (error) {
        next(error)
    }

    return response.status(OK).send({ message: "Success" });
}

function validateURL(url) {
    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/i;
    return urlPattern.test(url);
}
