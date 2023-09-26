import {NextApiHandler} from "next";
import Post from "../../../models/Post";
import {readFile} from "../../../lib/utils";
import {postValidationSchema, validateSchema} from "../../../lib/validator";
import {tag} from "postcss-selector-parser";

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

interface IncomingPost {
    title: string;
    content: string;
    slug: string;
    meta: string;
    tags: string;
}

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
    if(error) {
        return res.status(400).json({error})
    }

    const {title, content, meta, slug} = body;

    post.title = title;
    post.content = content;
    post.meta = meta;
    post.tags = tags;
    post.slug = slug;

    await post.save();
    res.json({post});
};

export default handler;