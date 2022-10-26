const { createClient } = require("@supabase/supabase-js");
const Joi = require("joi");
const Promise = require("bluebird");
const jwt = require("jsonwebtoken");

const config = process.env;

const supabase = createClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const schema = Joi.object({
    username: Joi.string().required(),
    photoID: Joi.string().required(),
    token: Joi.string().required()
});

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod === "POST") {
            const params = event.queryStringParameters
            await schema.validateAsync(params);
            // verification auth JWT
            const { data: allData } = await supabase
                .from('liked')
                .select("*")
                .match({ username: params.username })

            const decoded = jwt.verify(params.token, config.TOKEN_KEY);
            if (!decoded) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: "Unauthorized" }),
                };
            }
            // verif si déja like
            const already = allData[0].likedPhotos.filter(elem => elem === params.photoID);

            if (already[0] !== undefined) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Already liked" }),
                };
            }
            // ajout du like
            allData[0].likedPhotos.push(params.photoID)
            await supabase
                .from('liked')
                .update(allData[0])
                .match({ username: params.username });

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "succes" }),
            };
        } else if (event.httpMethod === "GET") {
            if (event.queryStringParameters.id) {
                //recupere like pour une photo donnée d'un utilisateur donné
                const { data: allData } = await supabase
                    .from('liked')
                    .select("*")
                    .match({ username: event.queryStringParameters.username })

                const already = allData[0].likedPhotos.filter(elem => elem === event.queryStringParameters.id);

                if (already[0] === undefined) {
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ message: 1 }),
                    };
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: -1 }),
                };
            } else {
                // recuperation de toutes les photos like par un utilisateur

                const { data: allData } = await supabase
                    .from('liked')
                    .select("*")
                    .match({ username: event.queryStringParameters.username });

                const allPhotos = await Promise.map(
                    allData[0].likedPhotos,
                    async photo => {
                        const { data: result } = await supabase
                            .from('photos')
                            .select("*")
                            .match({ id: photo });

                        return { photoLink: result[0].photoLink, username: result[0].username, titre: result[0].title, id: result[0].id };
                    }, { concurrency: 1 }
                );
                return {
                    statusCode: 200,
                    body: JSON.stringify({ data: allPhotos }),
                };
            }
        } else if (event.httpMethod === "DELETE") {
            // Supression du like d'un utilisateur
            const params = event.queryStringParameters;
            const { data: allData } = await supabase
                .from('liked')
                .select("*")
                .match({ username: params.username });
            const retiredLike = allData[0].likedPhotos.filter(elem => elem != params.photoID)
            await supabase
                .from('liked')
                .update({ likedPhotos: retiredLike })
                .match({ username: params.username });
            //await LikeModel.updateOne({ username: params.username }, { $pull: { likedPhotos: params.photoID } });

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Succes" }),
            };
        } else {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method error" }),
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