import express from "express";
import { User } from "./models/user.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';

export const userRouter = express.Router();


userRouter.post("/register", async (req, res) => {

    const { email, username, password } = req.body;

    try {
        const existUserResult = await User.findOne({ email: email });
        if (existUserResult > 0) {
            return res.status(400).json({ msg: "Email already exists", status: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ id: uuidv4(), Username: username, email: email, Password: hashedPassword });
        newUser.save();


        if (newUser) {
            res.status(200).json({ msg: "User registered succesfully", User: newUser, status: true });
        }
    } catch (err) {
        console.log(err);
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await User.findOne({ email: email });

        if (!existUser) {
            return res.status(400).json({ msg: "Email not found", status: false });
        }

        const checkPassword = await bcrypt.compare(password, existUser.Password);

        if (checkPassword === false) {
            return res.status(400).json({ msg: "Email or Password are incorrect", status: false });
        }

        res.status(200).json({ msg: "Login Succesful", User: existUser, status: true });

    } catch (err) {
        console.log(err);
    }
});