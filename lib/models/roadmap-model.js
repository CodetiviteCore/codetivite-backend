const mongoose = require('mongoose');
const { skillLevels, careers } = require('../utils/helper-utils');
const Schema = mongoose.Schema;

const roadmapSchema = new Schema({ any: {} });

const roadmapModel = mongoose.model("RoadMap", roadmapSchema);
module.exports = { roadmapModel, roadmapModel }

