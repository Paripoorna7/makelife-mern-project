const express = require("express");
const router = express.Router();
const Child = require("../models/Child");

/* GET children */
router.get("/", async (req,res)=>{
   const children = await Child.find();
   res.json(children);
});

/* ADD child */
router.post("/", async (req,res)=>{
   const child = new Child(req.body);
   await child.save();
   res.json(child);
});

/* DELETE child */
router.delete("/:id", async (req,res)=>{
   await Child.findByIdAndDelete(req.params.id);
   res.json({message:"Deleted"});
});

module.exports = router;
