import express from "express";
import { Password } from "../models/password.js";
export const passwordsRouter = express.Router();

passwordsRouter.get("/:id", async (req, res) => {
    const userId = req.params.id;
    const passwords = await Password.find({user_id: userId});
    res.json(passwords);
});

passwordsRouter.post("/save/:id", async (req, res) => {
    try {
        const { id, site, username, password } = req.body;
        const userId = req.params.id;
        const newPassword = new Password({ id: id, user_id: userId, site: site, username: username, password: password });

        await newPassword.save();

        res.status(200).json({msg:"Password saved successfully", status: true});
    } catch (error) {
        console.error("Error saving password:", error);
        res.status(500).json({msg: "Failed to save password", status: false});
    }
});

passwordsRouter.post("/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Password.findOneAndDelete({ id: id});
        
        if (result) {
            res.status(200).json({msg: "Password deleted successfully", status: true});
        } else {
            res.status(400).json({msg: "Password not found", status: false});
        }

    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).json({msg: "Failed to delete password", status: false});
    }
});