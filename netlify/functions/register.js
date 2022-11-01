const Joi = require("joi");
const cookie = require("cookie")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const config = process.env;

const supabase = createClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};

const saltRounds = 10;

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ message: "Method error" }),
            };
        };

        const hour = 3600000;

        const params = event.queryStringParameters
        await schema.validateAsync(params);
        // verif si le pseudo est disponible
        const { data: alreadyRegister } = await supabase
            .from('users')
            .select("*")
            .match({ username: params.username })
        //const alreadyRegister = await UserModel.find({ username: params.username });

        if (alreadyRegister[0]) {
            return {
                statusCode: 409,
                headers,
                body: JSON.stringify({ message: "Username already use" }),
            };
        };
        // hash mot de passe
        const hash = await bcrypt.hash(params.password, saltRounds);
        const { data: user } = await supabase
            .from('users')
            .insert({ username: params.username, password: hash })
        //const user = await UserModel.create({ username: params.username, password: hash });
        await supabase
            .from('liked')
            .insert({ username: params.username })
        //await LikeModel.create({ username: params.username });
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
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
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
            headers,
            body: JSON.stringify(err),
        };
    }
};
