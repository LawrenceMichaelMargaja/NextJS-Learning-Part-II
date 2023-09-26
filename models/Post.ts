// import mongoose from 'mongoose';
// const { Schema, models, model } = mongoose;
// import ObjectId from 'mongoose';
// import Model from 'mongoose';

import * as mongoose from "mongoose";

const { Schema, Types, models, model, ObjectId, Model } = mongoose;

/**
 * Note: importing of "ObjectId and Model are not the same as in the tutorial.
 * this is because the way it was imported there is not working.
 * This might cause problems in the future though.
 *
 * This is how it is uploaded in the tutorial.
 * const { Schema, models, model, ObjectId, Model } = mongoose;
 */

interface PostModelSchema {
    title: string;
    slug: string;
    meta: string;
    content: string;
    tags: string[];
    thumbnail: { url: string, public_id: string };
    author: mongoose.Types.ObjectId;
    createdAt: Date;
}

const PostSchema = new Schema<PostModelSchema>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        meta: {
            type: String,
            required: true,
            trim: true
        },
        tags: {
            type: [String]
        },
        thumbnail: {
            type: Object,
            url: String,
            public_id: String,
        },
        author: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true
    }
);

const Post = models?.Post || mongoose.model('Post', PostSchema);

export default Post as mongoose.Model<PostModelSchema>;
