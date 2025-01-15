
import { Document, model, Schema } from "mongoose";
import mongoose from "mongoose";

export interface IdUser extends Document {
    googleId: string,
    email: string,
    displayname: string,
    profileImage: string,
}


const userSchema: Schema = new Schema({
    googleId: { type: String, required: true , unique: true },
    email: { type: String, required: true , unique: true },
    displayname: { type: String, required: true },
    profileImage: { type: String, required: true },
})

export default model <IdUser>('User', userSchema);