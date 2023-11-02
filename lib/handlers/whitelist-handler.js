const Joi = require("joi");
const { whitelistModel } = require("../models/whitelist-model");
const { BAD_REQUEST, OK } = require("../utils/status-codes");
const { isTemporaryEmail } = require("../utils/helper-utils");

exports.addToWhitelist = async (request, response, next) => {
    const whitelistSchema = Joi.object({email: Joi.string().email().required()});
    const {error, value} = whitelistSchema.validate(request.body, {abortEarly: false});
    if(error) {
        let errorMessage = [];
        error.details.forEach(detail => {
            errorMessage.push(detail.message);
        })
        return response.status(BAD_REQUEST).send({ message: errorMessage })
    }
    if (isTemporaryEmail(value.email)) {
        return response.status(BAD_REQUEST).send({ message: "Invalid email provider" })
    }
    if(await whitelistModel.findById({_id: value.email})) {
        return response.status(BAD_REQUEST).send({ message: "Email already exist" })
    }
    
    let currentEmail = new whitelistModel({
        _id: value.email,
    });
    currentEmail = await currentEmail.save();

    response.status(OK).send(currentEmail);
}