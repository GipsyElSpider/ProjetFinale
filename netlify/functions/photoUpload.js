const mongoose = require('mongoose');
//const { UserModel } = require("../../model/User");
const Multipart = require('lambda-multipart');
const sharp = require("sharp");
const Promise = require("bluebird");
const { createClient } = require("@supabase/supabase-js");
const { ProfileModel } = require('../../model/Profile');
const { uuid } = require('uuidv4');
const { PhotoModel } = require("../../model/Photo")

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bnN5Ym50aWFiaGtheGtib3ZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NTM5MDIyNSwiZXhwIjoxOTgwOTY2MjI1fQ.73q9xtAKdzBTDV8-2lr2gKMxGxdUuLbdYoeYLwsROB8"
);

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
        const { buffer, ext } = await cropImage(files[0]._readableState.buffer.tail.data);
        console.log(fields)
        console.log(buffer, ext)
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