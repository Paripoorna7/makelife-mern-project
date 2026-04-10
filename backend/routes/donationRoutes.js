
const router = require('express').Router();
const Donation = require('../models/Donation');

router.post('/', async (req, res) => {
  try {
    const { donorName, amount, childId, childName, donorEmail, donorPhone } = req.body;
    const donationType = childId && childName ? 'sponsorship' : 'general';
    const donation = await Donation.create({
      donorName:  donorName  || 'Anonymous',
      amount,
      donorEmail,
      donorPhone,
      childId:    childId    || null,
      childName:  childName  || null,
      donationType
    });
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: 'Error saving donation', error });
  }
});

router.get('/', async (req,res)=>{
  const data = await Donation.find();
  res.json(data);
});

module.exports = router;
