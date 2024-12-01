import mongoose, { Schema } from "mongoose";
const passwordSchema = new mongoose.Schema({
    id: String,
    user_id: String,
    site: String,
    username: String,
    password: {
        encryptedData: String,
        iv: String
    },
})

export const Password = mongoose.model('Password', passwordSchema);