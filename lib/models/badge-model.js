const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const badgeSchema = new Schema({
  badge: {
    type: String,
    title: String,
    level: String,
    percentage: Number,
    note: String,
  },
});

module.exports = mongoose.model("badgeSchema", badgeSchema);
