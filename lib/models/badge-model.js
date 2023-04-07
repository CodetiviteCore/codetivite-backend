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
  level: {
    type: String,
    required: true,
  },
});

const badgeModel = mongoose.model("Badge", badgeSchema);
module.exports = { badgeSchema, badgeModel }