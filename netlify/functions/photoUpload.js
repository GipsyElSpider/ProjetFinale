const mongoose = require('mongoose');
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");
const { uuid } = require('uuidv4');
const { PhotoModel } = require("../../model/Photo")
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

mongoose.connect("mongodb://localhost:27017/projet-3wa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method error" }),
            };
        };

        await schema.validateAsync(event.queryStringParameters);

        const decoded = jwt.verify(event.queryStringParameters.token, config.TOKEN_KEY);

        if (!decoded) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized" }),
            };
        };

        const { data } = await supabase.storage
            .from('image')
            .download(event.queryStringParameters.link);

        let arrayBuf = await data.arrayBuffer();
        const beforeCrop = Buffer.from(arrayBuf)
        const { buffer, ext } = await cropImage(beforeCrop);
        const filename = uuid();

        await supabase.storage
            .from('image')
            .upload(`photos/${filename}.${ext}`, buffer, {
                cacheControl: '3600',
                upsert: false
            });

        const link = `https://lynsybntiabhkaxkbovs.supabase.co/storage/v1/object/public/image/photos/${filename}.${ext}`;

        const dataPhotos = await PhotoModel.create({
            username: event.queryStringParameters.username,
            title: event.queryStringParameters.titre,
            description: event.queryStringParameters.description,
            created_at: Date.now(),
            photoLink: link
        });

        await supabase
            .storage
            .from('images')
            .remove([event.queryStringParameters.link])

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "succes", data: dataPhotos._id })
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
    const { data: buffer, info } = await sharp(imagePath)
        .resize(600, 600)
        .webp()
        .toBuffer({ resolveWithObject: true });

    return { buffer, ext: info.format };
}