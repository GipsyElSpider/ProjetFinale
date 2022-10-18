const mongoose = require('mongoose');
const Multipart = require('lambda-multipart');
const sharp = require("sharp");
const Promise = require("bluebird");
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
    description: Joi.string().optional(),
    username: Joi.string().required(),
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

        const { fields, files } = await parseMultipartFormData(event);
        await schema.validateAsync(fields);
        const decoded = jwt.verify(fields.token, config.TOKEN_KEY);
        if (!decoded) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized" }),
            };
        }
        const { buffer, ext } = await cropImage(files[0]._readableState.buffer.tail.data);
        const filename = uuid();
        await supabase.storage.from('image').upload(`photos/${filename}.${ext}`, buffer, {
            contentType: `image/${ext}`,
            upsert: true,
        });

        const link = `https://lynsybntiabhkaxkbovs.supabase.co/storage/v1/object/public/image/photos/${filename}.${ext}`;

        const dataPhotos = await PhotoModel.create({
            username: fields.username,
            title: fields.titre,
            description: fields.description,
            created_at: Date.now(),
            photoLink: link,
            likes: 0
        });

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

const parseMultipartFormData = async (event) => {
    return new Promise((resolve, reject) => {
        const parser = new Multipart(event)

        parser.on('finish', (result) => {
            resolve({ fields: result.fields, files: result.files })
        })

        parser.on('error', (error) => {
            return reject(error)
        })
    })
};

async function cropImage(imagePath) {
    const { data: buffer, info } = await sharp(imagePath)
        .resize(600, 600)
        .webp()
        .toBuffer({ resolveWithObject: true });

    return { buffer, ext: info.format };
}