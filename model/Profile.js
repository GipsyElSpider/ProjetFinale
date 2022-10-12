const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProfileSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    profilePhoto: {
        type: String,
    },
    instagram: {
        type: String
    },
    twitter: {
        type: String
    },
    description: {
        type: String
    }
});

exports.ProfileModel = model("profiles", ProfileSchema);