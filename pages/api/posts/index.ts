import {NextApiHandler} from "next";
import dbConnect from "../../../lib/dbConnect";

const handler: NextApiHandler = async (req, res) => {
    const {method} = req

    switch (method) {
        case 'GET': {
            await dbConnect();
            res.json({ ok: true });
        }
    }
};

export default handler;