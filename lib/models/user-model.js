const mongoose = require("mongoose");
const Badge = require("./badge-model");
const Project = require('./project-model');
const { careers } = require("../utils/helper-utils");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    _id: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
      unique: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      default: "basic",
      enum: ["basic", "admin"],
    },
    accessToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    careerPath: {
      type: String,
      default: "",
      enum: [
        "",
        ...careers
      ],
    },
    currentSkillLevel: {
      type: String,
      enum: ["Beginner", "EntryLevel", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    badgesEarned: [Badge],
    completedProjects: [Project],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
