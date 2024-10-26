import express from "express";
import 'dotenv/config';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./Routes/users.js";
import { passwordsRouter } from "./Routes/passwords.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGO_URI;

let conn = await mongoose.connect(uri);
if (conn) {
    console.log("Database connected succesfully");
}

app.use("/api/v1/user", userRouter)
app.use("/api/v1/passwords", passwordsRouter);

app.listen(port, () => {
    console.log(`Server running in port ${port}`);
});