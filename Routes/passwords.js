import express from "express";
import { Password } from "./models/password.js";
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
        console.log("New password added");

        res.status(200).send("Password saved successfully");
    } catch (error) {
        console.error("Error saving password:", error);
        res.status(500).send("Failed to save password");
    }
});

passwordsRouter.post("/delete", async (req, res) => {
    try {
        const { id, user_id } = req.body;
        const resut = await Password.deleteOne({ id: id, user_id: user_id });
        console.log("Password deleted succesfully");

        res.status(200).send("Password deleted successfully");
    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).send("Failed to delete password");
    }
});