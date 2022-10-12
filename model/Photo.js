const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PhotosSchema = new Schema({
    username: {
        type: String
    },
    photoLink: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    created_at: {
        type: Date
    },
    title: {
        type: String
    },
    likes: {
        type: Number
    }
});

exports.PhotoModel = model("photos", PhotosSchema);