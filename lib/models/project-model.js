const mongoose = require('mongoose');
const { skillLevels } = require('../utils/helper-utils');
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

module.exports = mongoose.model("projectSchema", projectSchema);