import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Notes Route");
})

export default router;