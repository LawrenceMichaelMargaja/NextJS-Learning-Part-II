import {NextApiHandler} from "next";
import formidable from 'formidable';
import cloudinary from '../../lib/cloudinary';
// import {cloudinary} from "../../lib/cloudinary";

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

/**
 * Allows us to read image files from the folder "dev-blogs" in our cloud.
 */
const readAllImages: NextApiHandler = async (req, res) => {
    console.log("WHAAAAT -----------------")
    try {
        console.log("hey I made it here")
        const {resources} = await cloudinary.api.resources({
            resource_type: 'image',
            type: 'upload',
            prefix: "dev-blogs",
        });

        const images = resources.map(({secure_url}: any) => ({src: secure_url}));
        res.json({images})
    } catch (e: any) {
        console.log("the error --- ", e.message)
        res.status(500).json({e: e.message})
    }
}

const uploadNewImage: NextApiHandler = (req, res) => {

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: err.message });

        const imageFile = files.image as formidable.File;

        try {
            const {secure_url} = await cloudinary.uploader.upload(imageFile[0].filepath, {
                folder: 'dev-blogs'
            });
            res.json({src: secure_url});
        } catch (e) {
            console.log("the error === ", e)
        }
        // const imageFile = files.image as formidable.File;
    });
};

export default handler;