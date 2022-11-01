const Joi = require("joi");
const cookie = require("cookie")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

const config = process.env;


const supabase = createClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};

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
        // verif si l'utilisateur existe
        await schema.validateAsync(params);
        const { data: user } = await supabase
            .from("users")
            .select("*")
            .match({ username: params.username })
        //const user = await UserModel.find({ username: params.username });

        if (!user[0]) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ message: "Pseudo introuvable" }),
            };
        };
        // verif le mot de passe
        const match = await bcrypt.compare(params.password, user[0].password);

        if (match) {
            // mise en place de JWT TOKEN 
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
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({ message: "success" }),
            };
        };

        return {
            statusCode: 403,
            headers,
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
