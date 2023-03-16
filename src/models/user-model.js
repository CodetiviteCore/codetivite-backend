const { bool } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    default: "frontend-dev",
    enum: [
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
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
