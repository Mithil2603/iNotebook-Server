import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create a user using: POST "/api/auth/"
router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name) {
            return res.status(400).json({ error: "Name is Required!"});
        }

        if(!email) {
            return res.status(400).json({ error: "Email is Required!"});
        }

        if(!password) {
            return res.status(400).json({ error: "Password is Required!"});
        }

        // check if user exists
        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(409).json({ error: "Email already exists!" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        return res.status(201).json({ message: "User Created Successfully!" });
    }
    catch (err) {
        console.error("Error Creating User: ", err.message);
        return res.status(500).json({ error: "server error!" })
    }
})

export default router;