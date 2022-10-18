const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProfileSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    myPhotos: {
        type: [String]
    },
});

exports.ProfileModel = model("profiles", ProfileSchema);