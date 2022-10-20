const Joi = require("joi");
const mongoose = require('mongoose');
const { UserModel } = require("../../model/User");
const { LikeModel } = require("../../model/Liked");
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

const saltRounds = 10;

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
        // verif si le pseudo est disponible
        const alreadyRegister = await UserModel.find({ username: params.username });
        
        if (alreadyRegister[0]) {
            return {
                statusCode: 409,
                body: JSON.stringify({ message: "Username already use" }),
            };
        };
        // hash mot de passe
        const hash = await bcrypt.hash(params.password, saltRounds);
        const user = await UserModel.create({ username: params.username, password: hash });
        await LikeModel.create({ username: params.username });
        // creation JWT
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

    } catch (err) {
        console.log("error", err);
        return {
            statusCode: 400,
            body: JSON.stringify(err),
        };
    }
};
