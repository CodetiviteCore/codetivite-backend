const mongoose = require('mongoose');
const { skillLevels, careers } = require('../utils/helper-utils');
const Schema = mongoose.Schema;

const roadmapSchema = new Schema({
    careerPath: {
        type: String,
        required: true,
    },
    levels: {
        type: [String],
        required: true,
    }
});

const roadmapModel = mongoose.model("RoadMap", roadmapSchema);
module.exports = { roadmapModel, roadmapModel }

