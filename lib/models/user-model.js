const { bool } = require("joi");
const mongoose = require("mongoose");
const Badge = require("./badge-model");
const Project = require('./project-model');
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
        "frontend-dev",
        "backend-dev",
        "solidity-dev",
        "blockchain-dev",
        "defi-dev",
        "uiux",
        "technical-wri",
        "full-stack-dev",
        "product-manager",
        "community-manager",
        "rust-dev",
        "devops",
        "graphic-des",
        "smart-contract-dev",
      ],
    },
    currentSkillLevel: {
      title: {
        type: String,
        enum: ["Beginner", "EntryLevel", "Intermediate", "Advanced"],
        default: "Beginner",
      },
      level: String,
      percentage: Number,
      note: String,
    },
    averageSalary: {
      title: String,
      amount: Number,
      percentage: Number,
      note: String,
    },
    badgesEarned: [Badge],
    completedProjects: [Project],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
