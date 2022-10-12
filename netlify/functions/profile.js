const mongoose = require('mongoose');
const Joi = require('joi')
const { UserModel } = require("../../model/User");
const { ProfileModel } = require("../../model/Profile");

mongoose.connect("mongodb://localhost:27017/projet-3wa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const schema = Joi.object({
    username: Joi.string().required(),
});

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "GET") {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method error" }),
            };
        };
        await schema.validateAsync(event.queryStringParameters);

        const data = await UserModel.find({ username: event.queryStringParameters.username }, 'username');
        const image = await ProfileModel.find({ username: event.queryStringParameters.username }, 'profilePhoto');

        if (data[0] === undefined) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'data not found' }),
            };
        };

        return {
            statusCode: 200,
            body: JSON.stringify({ data: data[0].username, link: image[0].profilePhoto }),
        };

    } catch (err) {
        console.log("error", err);
        return {
            statusCode: 400,
            body: JSON.stringify(err),
        };
    }
};
