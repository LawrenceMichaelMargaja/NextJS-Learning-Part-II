import {NextApiHandler} from "next";
import Post from "../../../models/Post";
import {readFile} from "../../../lib/utils";
import {postValidationSchema, validateSchema} from "../../../lib/validator";
import cloudinary from '../../../lib/cloudinary'
import {tag} from "postcss-selector-parser";
import formidable from "formidable";
import {IncomingPost} from "../../../utils/types";

export const config = {
    api: {
        bodyParser: false
    },
};

const handler: NextApiHandler = (req, res) => {
    const {method} = req;

    switch (method) {
        case "PATCH":
            return updatePost(req, res);
        default:
            res.status(404).send("Not Found!");
    }
};

const updatePost: NextApiHandler = async (req, res) => {
    const postId = req.query.postId as string;

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({error: "Post not Found!"});
    }

    const {files, body} = await readFile<IncomingPost>(req);
    let tags = [];

    // tags will be in string form so converting them to an array
    if (body.tags) {
        tags = JSON.parse(body.tags as string);
    }

    const error = validateSchema(postValidationSchema, {...body, tags})
    if (error) {
        return res.status(400).json({error})
    }

    const {title, content, meta, slug} = body;

    post.title = title;
    post.content = content;
    post.meta = meta;
    post.tags = tags;
    post.slug = slug;

    // update thumbnail only if there is any.
    const thumbnail = files.thumbnail as formidable.File
    if (thumbnail) {
        const {secure_url: url, public_id} = await cloudinary.uploader.upload(thumbnail.filepath, {
            folder: "dev-blogs",
        });

        /**
         * #1 - condition => the post can already have a thumbnail so remove the old one and upload the new image and then update the record inside the DB.
         */
        const publicId = post.thumbnail?.public_id;
        if(publicId) {
            await cloudinary.uploader.destroy(publicId)
        }
        /**
         * #2 = condition => the post can be without thumbnail, just upload image and update the record inside the DB.
         */
        post.thumbnail = {url, public_id}
    }

    await post.save();
    res.json({post});
};

export default handler;