import express from "express";
import { connectToMongo } from "./db.js";

// Imported Routes
import authRouter from "./routes/auth.js";
import notesRouter from "./routes/notes.js";

const app = express();
const port = 8000;

app.use(express.json())

connectToMongo();

// Available Routes
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);

app.listen(port, ()=> {
    console.log(`Server Started at http://localhost:${port}`)
})