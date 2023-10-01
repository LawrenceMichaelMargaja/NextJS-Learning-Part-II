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

export interface UserModelSchema {
    name: string;
    email: string;
    role: 'user' | 'admin';
    provider: 'github';
    avatar?: string;
}

const UserSchema = new Schema<UserModelSchema>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin']
        },
        provider: {
            type: String,
            enum: ['github']
        },
        avatar: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

const User = models?.User || mongoose.model('User', UserSchema);

export default User as mongoose.Model<UserModelSchema>;
