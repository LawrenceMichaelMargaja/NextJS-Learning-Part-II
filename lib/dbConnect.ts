import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;

const dbConnect = async () => {
    try {
        // console.log("I AM AT THE DB CONNECT")
        // console.log("URI is: ", uri); // log URI to check if it's correct
        const connection = await mongoose.connect(uri);
        // console.log("the db connection --- ", connection);
        return connection;
    } catch (error) {
        console.log("DB Connection Fail --- ", error);
    }
}

export default dbConnect;