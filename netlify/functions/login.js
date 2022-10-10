const Joi = require("joi");
const mongoose = require('mongoose');
const { UserModel } = require("../../model/User");
//const { withSession, getSession } = require('netlify-functions-session-cookie');
const crypto = require('crypto');
const cookie = require("cookie")
mongoose.connect("mongodb://localhost:27017/projet-3wa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method error" }),
            };
        };

        const hour = 3600000;
        const params = JSON.parse(event.body)
        await schema.validateAsync(params);
        console.log(params)

        const user = await UserModel.find({ username: params.username });

        console.log(user[0])
        if (!user[0]) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Pseudo introuvable" }),
            };
        };

        const hash = crypto.createHash('sha256').update(params.password).digest('hex');

        if (hash === user[0].password) {
            const myCookie = cookie.serialize('user', params.username, {
                secure: true,
                httpOnly: true,
                path: '/',
                maxAge: hour * 12,
            });

            return {
                statusCode: 200,
                headers: {
                    'Set-Cookie': myCookie,
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'text/html',
                },
                body: JSON.stringify({ message: "success" }),
            };
        };

        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Mot de passe incorrect" }),
        };

    } catch (err) {
        console.log("error", err);
        return {
            statusCode: 400,
            body: JSON.stringify(err),
        };
    }
};
