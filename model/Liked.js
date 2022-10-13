const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LikeSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    likedPhotos: {
        type: [String],
    }
});

exports.LikeModel = model("profiles", LikeSchema);