import {NextApiHandler} from "next";
import {isAuth} from "../../../lib/utils";
import {commentValidationSchema, validateSchema} from "../../../lib/validator";
import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post";
import Comment from '../../../models/Comment';
import {isValidObjectId} from "mongoose";

const handler: NextApiHandler = (req, res) => {
    const {method} = req;

    switch (method) {
        case 'POST':
            return updateLike(req, res)
        default:
            res.status(404).send("Not Found!")
    }
    ;
};

const updateLike: NextApiHandler = async (req, res) => {
    const user = await isAuth(req, res);
    if (!user) {
        return res.status(403).send({error: "Unauthorized Request!"});
    }

    const {commentId} = req.body

    if (!isValidObjectId(commentId)) {
        return res.status(422).json({error: "Invalid Comment Id!"});
    }

    await dbConnect();

    const comment = await Comment.findById(commentId);

    if (!comment) {
        return res.status(404).json({error: "Comment not found!"});
    }

    const oldLikes = comment.likes || [];
    // const likedBy = user.id as any;
    const likedBy = user.id as any;

    // like and unlike
    // this is for unlike
    if (oldLikes.includes(likedBy)) {
        comment.likes = oldLikes.filter((like) => (
            like.toString() !== likedBy.toString()
        ));
    }
    //this is to like the comment
    else comment.likes = [...oldLikes, likedBy]

    await comment.save()
    res.status(201).json({comment})

}

export default handler;