import express from "express";
const router = express.Router();
router.get("/health",(req,res)=>{
    res.status(200).json({
        server:"running",
        database:"Connnected"
    })
})
export default router;