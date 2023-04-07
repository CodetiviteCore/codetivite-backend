const mongoose = require("mongoose");
const { skillLevels } = require("../utils/helper-utils");
const Schema = mongoose.Schema;

const badgeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  skillLevel: {
    type: String,
    enum: skillLevels,
    default: "Beginner",
  },
});

const badgeModel = mongoose.model("Badge", badgeSchema);
module.exports = { badgeSchema, badgeModel }