import express from "express";
import 'dotenv/config';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { Password } from "./models/password.js";

const app = express();
const port = 3000;

app.use(bodyParser.json())
app.use(cors())

const uri = process.env.MONGO_URI;

let conn = await mongoose.connect(uri);
if(conn){
    console.log("Database connected succesfully");
}

app.get("/", async (req, res)=>{
    const passwords = await Password.find();
    res.json(passwords);
})

app.post("/save", async (req, res) => {
    try {
        const { id, site, username, password } = req.body;
        const newPassword = new Password({ id: id, site: site, username: username, password: password });
        
        await newPassword.save();  // Ensure save operation is awaited
        console.log("New password added");
        
        res.status(200).send("Password saved successfully");
    } catch (error) {
        console.error("Error saving password:", error);
        res.status(500).send("Failed to save password");
    }
});

app.post("/delete", async(req, res)=>{
    try {
        const { id } = req.body;
        const resut = await Password.deleteOne({id: id});
        console.log("Password deleted succesfully");
        
        res.status(200).send("Password deleted successfully");
    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).send("Failed to delete password");
    }
})

app.listen(port, ()=>{
    console.log(`Server running in port ${port}`);
});