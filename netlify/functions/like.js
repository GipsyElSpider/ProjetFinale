const { LikeModel } = require("../../model/Liked");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/projet-3wa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "POST" && event.httpMethod !== "GET") {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method error" }),
            };
        };

        if (event.httpMethod !== "POST") {

        } else {

        };
    } catch (error) {
        console.log("error", err);
        return {
            statusCode: 400,
            body: JSON.stringify(err),
        };
    }
};