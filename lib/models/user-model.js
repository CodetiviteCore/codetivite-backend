const mongoose = require("mongoose");
const { badgeSchema } = require("./badge-model");
const { projectSchema } = require("./project-model");
const { careers, skillLevels, badges } = require("../utils/helper-utils");
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
      enum: skillLevels,
      default: "junior",
    },
    badgesEarned: {
      type: [String],
      enum: badges,
      default: ["fresher"]
    },
    completedProjects: {
      type: [{
        projectId: {
          type: Schema.Types.ObjectId,
          ref: "Project",
          required: true
        },
        isCompleted: {
          type: Boolean,
          default: false
        },
        skillLevel: {
          type: String,
          enum: skillLevels,
          required: true
        },
        roadmap: {
          type: String,
          enum: careers,
          required: true
        }
      }]
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = { userModel, userSchema }
