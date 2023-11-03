const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const whitelistSchema = new Schema({
    _id: {
        type: String,
        required: true
    }
});

const whitelistModel = mongoose.model("Whitelist", whitelistSchema);
module.exports = { whitelistModel, whitelistModel }