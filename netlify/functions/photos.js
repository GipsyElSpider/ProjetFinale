const mongoose = require('mongoose');
const Joi = require('joi')
const { UserModel } = require("../../model/User");
const { PhotoModel } = require("../../model/Photo");

mongoose.connect("mongodb://localhost:27017/projet-3wa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const schema = Joi.object({
    id: Joi.string().required(),
});

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "GET") {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method error" }),
            };
        };

        /* if(event.queryStringParameters)
        await schema.validateAsync(event.queryStringParameters); */
        if (event.queryStringParameters.id) {
            const data = await PhotoModel.find({ _id: event.queryStringParameters.id });
            console.log(data)

            if (data[0] === undefined) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'data not found' }),
                };
            };

            return {
                statusCode: 200,
                body: JSON.stringify({ data: data[0] }),
            };
        } else {
            const data = await PhotoModel.find({}).sort({ created_at: -1 });
            console.log(data)

            if (data[0] === undefined) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'data not found' }),
                };
            };

            return {
                statusCode: 200,
                body: JSON.stringify({ data: data }),
            };
        }
    } catch (err) {
        console.log("error", err);
        return {
            statusCode: 400,
            body: JSON.stringify(err),
        };
    }
};
