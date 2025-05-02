import express from "express";

const router = express.Router();

router.get("/", (req, res)=> {
    const obj = {
        a: "this",
        num: 114
    }
    res.json(obj);
})

export default router;