import {NextApiHandler} from "next";
import formidable from 'formidable';
import cloudinary from '../../lib/cloudinary';

export const config = {
    api: { bodyParser: false },
};

const handler: NextApiHandler = (req, res) => {
    const {method} = req;

    switch (method) {
        case 'POST': return uploadNewImage(req, res)
        case 'GET' : return readAllImages(req, res)
        default: return res.status(404).send("Not Found!")

    }
};

const readAllImages: NextApiHandler = (req, res) => {

}

const uploadNewImage: NextApiHandler = (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if(err) return res.status(500).json({error: err.message});

        const imageFile = files.image as formidable.File;
        const {secure_url} = await cloudinary.uploader.upload(imageFile.filepath, {
            folder: 'dev-blogs'
        });

        res.json({image: secure_url});
    });
};

export default handler;