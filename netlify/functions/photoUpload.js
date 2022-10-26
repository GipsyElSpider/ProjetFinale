const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");
const { uuid } = require('uuidv4');
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const config = process.env;

const supabase = createClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const schema = Joi.object({
    titre: Joi.string().optional(),
    description: Joi.string().optional().allow(""),
    username: Joi.string().required(),
    link: Joi.string().required(),
    token: Joi.string().required()
}).required();

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method error" }),
            };
        };

        await schema.validateAsync(event.queryStringParameters);
        // verif authentification
        const decoded = jwt.verify(event.queryStringParameters.token, config.TOKEN_KEY);

        if (!decoded) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized" }),
            };
        };
        // recupere la photo en taille de base
        const { data } = await supabase.storage
            .from('image')
            .download(event.queryStringParameters.link);

        let arrayBuf = await data.arrayBuffer();
        const beforeCrop = Buffer.from(arrayBuf)
        const { buffer, ext } = await cropImage(beforeCrop);
        const filename = uuid();
        // upload la nouvelle image
        await supabase.storage
            .from('image')
            .upload(`photos/${filename}.${ext}`, buffer, {
                cacheControl: '3600',
                upsert: false
            });

        const link = `https://lynsybntiabhkaxkbovs.supabase.co/storage/v1/object/public/image/photos/${filename}.${ext}`;
        // données mis en base
        const { data: dataPhotos, error } = await supabase
        .from("photos")
        .insert({
            username: event.queryStringParameters.username,
            title: event.queryStringParameters.titre,
            description: event.queryStringParameters.description,
            photoLink: link
        });
        console.log(error)
        await supabase
            .storage
            .from('images')
            .remove([event.queryStringParameters.link])

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "succes", data: dataPhotos[0].id })
        };

    } catch (err) {
        console.log("error", err);
        return {
            statusCode: 400,
            body: JSON.stringify(err),
        };
    }
};

async function cropImage(imagePath) {
    // Crop de l'image en 600x600 et changement de l'extension en webp
    const { data: buffer, info } = await sharp(imagePath)
        .resize(600, 600)
        .webp()
        .toBuffer({ resolveWithObject: true });

    return { buffer, ext: info.format };
}