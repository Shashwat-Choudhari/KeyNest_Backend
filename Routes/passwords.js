import express from "express";
import { Password } from "../models/password.js";
import crypto from "crypto";
import 'dotenv/config';
export const passwordsRouter = express.Router();

const ENCRYPTION_ALGORITHM = "aes-256-ctr";
const ENCRYPTION_KEY = crypto.scryptSync(process.env.MASTER_PASSWORD, 'salt', 32);
const IV_LENGTH = 16;

function encryptPassword(password) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
    return { encryptedData: encrypted.toString("hex"), iv: iv.toString("hex") };
}

function decryptPassword(encryptedPassword, iv) {
    const decipher = crypto.createDecipheriv(
        ENCRYPTION_ALGORITHM,
        ENCRYPTION_KEY,
        Buffer.from(iv, "hex")
    );
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedPassword, "hex")),
        decipher.final(),
    ]);
    return decrypted.toString();
}

passwordsRouter.get("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const passwords = await Password.find({ user_id: userId });

        const decryptedPasswords = passwords.map((entry) => ({
            id: entry.id,
            user_id: entry.user_id,
            site: entry.site,
            username: entry.username,
            password: decryptPassword(entry.password.encryptedData, entry.password.iv),
        }));

        res.json(decryptedPasswords);
    } catch (error) {
        console.error("Error fetching passwords:", error);
        res.status(500).json({ msg: "Failed to fetch passwords", status: false });
    }
});

passwordsRouter.post("/save/:id", async (req, res) => {
    try {
        const { id, site, username, password } = req.body;
        const userId = req.params.id;
        const {encryptedData, iv} = encryptPassword(password);

        const newPassword = new Password({
            id: id,
            user_id: userId,
            site: site,
            username: username,
            password: {
                encryptedData: encryptedData,
                iv: iv,
            }
        });

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