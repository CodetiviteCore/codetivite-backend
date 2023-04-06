const mongoose = require("mongoose");
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

module.exports = mongoose.model("badgeSchema", badgeSchema);
