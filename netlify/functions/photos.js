const { createClient } = require("@supabase/supabase-js");

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

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "GET") {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ message: "Method error" }),
            };
        };
        
        if (event.queryStringParameters.id) {
            // recupere 1 photos par ID
            const { data } = await supabase
                .from("photos")
                .select("*")
                .match({ id: event.queryStringParameters.id })
            //const data = await PhotoModel.find({ _id: event.queryStringParameters.id });

            if (data[0] === undefined) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ message: 'data not found' }),
                };
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ data: data[0] }),
            };
        } else if (event.queryStringParameters.username) {
            // recupere toutes les photos d'un utilisateur
            const { data } = await supabase
                .from("photos")
                .select("*")
                .match({ username: event.queryStringParameters.username });
            //const data = await PhotoModel.find({ username: event.queryStringParameters.username });
            if (data[0] === undefined) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ message: 'data not found' }),
                };
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ data: data }),
            };
        } else {
            // recuperent toutes les phtos par dates decroissante
            
            const { data } = await supabase
                .from("photos")
                .select("*")
            //const data = await PhotoModel.find({}).sort({ created_at: -1 });
            
            if (data[0] === undefined) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ message: 'data not found' }),
                };
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ data: data }),
            };
        }
    } catch (err) {
        console.log("error", err);
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify(err),
        };
    }
};
