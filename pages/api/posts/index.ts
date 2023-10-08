import {NextApiHandler} from "next";
import dbConnect from "../../../lib/dbConnect";
import Joi from "joi";
import {postValidationSchema, validateSchema} from "../../../lib/validator";
import {formatPosts, isAdmin, readFile, readPostsFromDb} from "../../../lib/utils";
import Post from "../../../models/Post";
import formidable from "formidable";
import cloudinary from '../../../lib/cloudinary';
import {IncomingPost, UserProfile} from "../../../utils/types";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";

export const config = {
    api: {bodyParser: false}
};

const handler: NextApiHandler = async (req, res) => {
    const {method} = req

    switch (method) {
        case 'GET':
            return readPosts(req, res);
        case 'POST': {
            return createNewPost(req, res)
        }
    }
};

//from chat gpt
const createNewPost: NextApiHandler = async (req, res) => {
    const admin = await isAdmin(req, res);
    if(!admin) {
        return res.status(401).json({error: "Unauthorized Request!"});
    };

    const {files, body} = await readFile<IncomingPost>(req);

    // Your logic dealing with files should be here
    let thumbnail: formidable.File | null = null;

    if (Array.isArray(files.thumbnail)) {
        thumbnail = files.thumbnail[0] as formidable.File;
    } else if (files.thumbnail) {
        thumbnail = files.thumbnail as formidable.File;
    }

    console.log("the body === ", body);
    let tags = [];

    // tags will be in string form so we use JSON.parse to convert them into an array.
    if (body.tags) {
        tags = JSON.parse(body.tags as string);
    }

    const error = validateSchema(postValidationSchema, {...body, tags});
    if (error) {
        return res.status(400).json({error});
    }

    const {title, content, slug, meta} = body;

    await dbConnect();
    const alreadyExists = await Post.findOne({ slug });
    if (alreadyExists) {
        return res.status(400).json({error: "Slug needs to be unique"});
    }

    // create new posts
    const newPost = new Post({
        title,
        content,
        slug,
        meta,
        tags
    });

    // Uploading thumbnail if there is any
    if (thumbnail) {
        const {secure_url: url, public_id} = await cloudinary.uploader.upload(thumbnail.filepath, {
            folder: 'dev-blogs',
        });
        newPost.thumbnail = {url, public_id};
    }
    await newPost.save();

    res.json({post: newPost});
}



// const createNewPost: NextApiHandler = async (req, res) => {
//     const admin = await isAdmin(req, res);
//     if(!admin) {
//         return res.status(401).json({error: "Unauthorized Request!"});
//     };
//
//     const {files, body} = await readFile<IncomingPost>(req)
//
//     console.log("the body === ", body);
//     let tags = [];
//
//     // tags will be in string form so we use JSON.parse to convert them into an array.
//     if (body.tags) {
//         tags = JSON.parse(body.tags as string);
//     }
//
//     const error = validateSchema(postValidationSchema, {...body, tags});
//
//     if (error) {
//         return res.status(400).json({error})
//     }
//
//     const {title, content, slug, meta} = body
//
//     await dbConnect()
//     const alreadyExists = await Post.findOne({
//         slug
//     });
//     if (alreadyExists) {
//         return res.status(400).json({error: "Slug needs to be unique"});
//     }
//
//     // create new posts
//     const newPost = new Post({
//         title,
//         content,
//         slug,
//         meta,
//         tags
//     });
//
//     // Uploading thumbnail if there is any
//     const thumbnail = files.thumbnail as formidable.File;
//     if (thumbnail) {
//         const {secure_url: url, public_id} = await cloudinary.uploader.upload(thumbnail.filepath, {
//             folder: 'dev-blogs',
//         });
//         newPost.thumbnail = {url, public_id};
//     }
//     await newPost.save();
//
//     res.json({post: newPost});
// }

const readPosts: NextApiHandler = async (req, res) => {
    try {
        const {limit, pageNo, skip} = req.query as {limit: string, pageNo: string, skip: string};
        const posts = await readPostsFromDb(
            parseInt(limit),
            parseInt(pageNo),
            parseInt(skip),
        );
        res.json({posts: formatPosts(posts)});
        return posts;
    } catch (error: any) {
        // return {notFound: true};
        res.status(500).json({error: error.message});
    }
}

export default handler;