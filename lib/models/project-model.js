const mongoose = require('mongoose');
const { skillLevels, careers } = require('../utils/helper-utils');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  }, 
  index: Number, 
  skillLevel: {
    type: String,
    enum: skillLevels,
    required: true
  },
  roadmap: {
    type: String,
    default: "",
    enum: [
      "",
      ...careers
    ],
  },
  description: {
    type: String,
    required: true
  }, 
  completedCount: {
    type: Number,
    default: 0
  }, 

},
  { timestamps: true }
);

const projectModel = mongoose.model("Project", projectSchema);
module.exports = { projectModel, projectSchema }