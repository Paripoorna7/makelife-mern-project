
const router = require('express').Router();
const Donation = require('../models/Donation');

router.post('/', async (req,res)=>{
  const donation = await Donation.create(req.body);
  res.json(donation);
});

router.get('/', async (req,res)=>{
  const data = await Donation.find();
  res.json(data);
});

module.exports = router;
