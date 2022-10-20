const Joi = require("joi");
const mongoose = require('mongoose');
const { UserModel } = require("../../model/User");
const cookie = require("cookie")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

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
        
        const params = event.queryStringParameters
        await schema.validateAsync(params);
        const user = await UserModel.find({ username: params.username });

        if (!user[0]) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: "Pseudo introuvable" }),
            };
        };

        const match = await bcrypt.compare(params.password, user[0].password);

        if (match) {
            const token = jwt.sign(
                { user_id: user._id, username: params.username },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            const myCookie = cookie.serialize('user', token, {
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
            statusCode: 403,
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
