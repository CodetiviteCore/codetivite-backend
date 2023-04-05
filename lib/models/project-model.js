const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projects: {
        title: String,
        level: String,
        percentage: Number,
        note: String,
      },
})

module.exports = mongoose.model("projectSchema", projectSchema);