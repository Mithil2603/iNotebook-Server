import express from "express";
import { connectToMongo } from "./db.js";

const app = express();
const port = 8000;

connectToMongo();

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(port, ()=> {
    console.log(`Server Started at http://localhost:${port}`)
})