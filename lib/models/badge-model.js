const mongoose = require("mongoose");
const { skillLevels } = require("../utils/helper-utils");
const Schema = mongoose.Schema;

const badgeSchema = new Schema({
  _id:{
    type: Number
  },
  title: {
    type: String,
    required: true,
  }
});

const badgeModel = mongoose.model("Badge", badgeSchema);
module.exports = { badgeSchema, badgeModel }