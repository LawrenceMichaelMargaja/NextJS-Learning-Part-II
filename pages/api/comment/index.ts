import {NextApiHandler} from "next";
import {isAuth} from "../../../lib/utils";
import {commentValidationSchema, validateSchema} from "../../../lib/validator";

const handler: NextApiHandler = (req, res) => {
    const { method } = req;

    switch (method) {
        case 'POST': return createNewComment(req, res)
        default: res.status(404).send("Not Found!")
    };
};

const createNewComment: NextApiHandler = async (req, res) => {
    // const user = await isAuth(req, res);
    // if(!user) {
    //     return res.status(403).send({error: "Unauthorized Request!"});
    // }

    const error = validateSchema(commentValidationSchema, req.body)
    if(error) {
        return res.status(422).json({error});
    }
}

export default handler;