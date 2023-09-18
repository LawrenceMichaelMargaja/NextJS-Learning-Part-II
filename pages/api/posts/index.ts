import {NextApiHandler} from "next";
import dbConnect from "../../../lib/dbConnect";
import Joi from "joi";
import {postValidationSchema, validateSchema} from "../../../lib/validator";
import {readFile} from "../../../lib/utils";
import Post from "../../../models/Post";

export const config = {
    api: { bodyParser: false }
};

const handler: NextApiHandler = async (req, res) => {
    const {method} = req

    switch (method) {
        case 'GET': {
            await dbConnect();
            res.json({ ok: true });
        }
        case 'POST': {
            return createNewPost(req, res)
        }
    }
};

const createNewPost: NextApiHandler = async (req, res) => {
    const {files, body} = await readFile(req)

    console.log("the body === ", body);
    let tags = [];

    // tags will be in string form so we use JSON.parse to convert them into an array.
    if(body.tags) {
        tags = JSON.parse(body.tags as string);
    }

    const error  = validateSchema(postValidationSchema, {...body, tags});

    if(error) {
        return res.status(400).json({ error })
    }

    const { title, content, slug, meta } = body

    await dbConnect()
    const alreadyExists = await Post.findOne({
        slug
    });
    if(alreadyExists) {
        return res.status(400).json({error: "Slug needs to be unique"});
    }

    // create new post
    const newPost = new Post({
        title,
        content,
        slug,
        meta,
        tags
    });

    await newPost.save();

    res.json({post: newPost});
}

export default handler;