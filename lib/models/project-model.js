const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  roadmap: {
    type: String,
    required: true
  }
},
  { timestamps: true }
);

const projectModel = mongoose.model("Project", projectSchema);
module.exports = { projectModel, projectSchema }