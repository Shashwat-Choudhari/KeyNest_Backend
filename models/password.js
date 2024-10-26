import mongoose, { Schema } from "mongoose";
const passwordSchema = new mongoose.Schema({
    id: String,
    user_id: String,
    site: String,
    username: String,
    password: String
})

export const Password = mongoose.model('Password', passwordSchema);