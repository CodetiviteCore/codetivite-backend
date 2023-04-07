const mongoose = require('mongoose');
const { skillLevels, careers } = require('../utils/helper-utils');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },  
  skillLevel: {
    type: String,
    enum: skillLevels,
    default: "Beginner",
  },
  roadmap: {
    type: String,
    default: "",
    enum: [
      "",
      ...careers
    ],
  }
},
  { timestamps: true }
);

const projectModel = mongoose.model("Project", projectSchema);
module.exports = { projectModel, projectSchema }