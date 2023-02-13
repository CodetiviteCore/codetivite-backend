const { Router, request, response } = require("express");
const createHttpError = require("http-errors");
const userModel = require("../models/userModel");

const router = Router();

router.post("/mailList", async (request, response, next) => {
  try {
    const { firstName, email } = request.body;

    if (!firstName || !email) throw createHttpError(400, "Invalid Request Body");

    let currentUser = await userModel.findById(email);

    if (!currentUser) {
      currentUser = new userModel({
        _id: email,
        firstName,
      });
      currentUser = await currentUser.save();
    }

    response.status(200).json({
      firstname: currentUser.firstName,
      email: currentUser._id,
    });
  } catch (error) {
    next(createHttpError(500, error));
  }
});

module.exports = router;