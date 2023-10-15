import {NextApiHandler} from "next";
import {isAuth} from "../../../lib/utils";

const handler: NextApiHandler = (req, res) => {
    const { method } = req;

    switch (method) {
        case 'POST': return createNewComment(req, res)
        default: res.status(404).send("Not Found!")
    };
};

const createNewComment: NextApiHandler = async (req, res) => {
    const user = await isAuth(req, res);
    if(!user) {
        return res.status(403).send({error: "Unauthorized Request!"});
    }
}

export default handler;