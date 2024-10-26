import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    id: String,
    Username: String,
    email: String,
    Password: String
});

export const User = mongoose.model('User', userSchema);