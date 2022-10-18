const mongoose = require('mongoose');
const { PhotoModel } = require('../../model/Photo');

mongoose.connect("mongodb://localhost:27017/projet-3wa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "GET") {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method error" }),
            };
        };
        
        if (event.queryStringParameters.id) {
            const data = await PhotoModel.find({ _id: event.queryStringParameters.id });

            if (data[0] === undefined) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'data not found' }),
                };
            };

            return {
                statusCode: 200,
                body: JSON.stringify({ data: data[0] }),
            };
        } else if (event.queryStringParameters.username) {
            const data = await PhotoModel.find({ username: event.queryStringParameters.username });
            if (data[0] === undefined) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'data not found' }),
                };
            };

            return {
                statusCode: 200,
                body: JSON.stringify({ data: data }),
            };
        } else {
            const data = await PhotoModel.find({}).sort({ created_at: -1 });

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
