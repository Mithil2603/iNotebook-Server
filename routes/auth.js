import dotenv from "dotenv";
import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

// Create a user using: POST "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters.").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      // if there are errors, return bad requests and errors
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
      //   const saltRounds = 10;  // or
      const saltRounds = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // create user if all validations passed
      // user variable is creating for generating jwt token below
      const user = await User.create({
        name,
        email,
        password: hashedPassword, // hash password to store in Database
      });

      // sending jwt token on registration success
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtToken = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "7d", // expires in 7 days
      });

      res.status(201).json({
        success: true,
        message: "User created successfully!",
        token: jwtToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] Error Creating User: `,
        err.message
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Please enter Password").exists(),
  ],
  async (req, res) => {
    try {
      // if there are errors, return bad requests and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // fetching email and password from request body
      const { email, password } = req.body;

      // check the email exists or not
      const user = await User.findOne({ email });

      // if email doesn't exists, throw error
      if (!user) {
        return res
          .status(400)
          .json({ error: "Email or Password is Incorrect!" });
      }

      // compare password from Database
      const comparePassword = await bcrypt.compare(password, user.password);

      // if password doesn't match throw same error as email
      if (!comparePassword) {
        return res
          .status(400)
          .json({ error: "Email or Password is Incorrect!" });
      }

      // sending jwt token on login success
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtToken = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "7d", // expires in 7 days
      });

      res.status(201).json({
        success: true,
        message: "Login success!",
        token: jwtToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Login Error: `, err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
