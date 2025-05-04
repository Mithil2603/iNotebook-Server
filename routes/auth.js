import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

const router = express.Router();

// Create a user using: POST "/api/auth/"
router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters.").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if the user exists.
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(409).json({ error: "Email already exists!" });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await User.create({
        name,
        email,
        password: hashedPassword,
      });
      res.status(201).json({ message: "User created Successfully!" });
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] Error Creating User: `,
        err.message
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
