
const router = require('express').Router();
const Donation = require('../models/Donation');

<<<<<<< HEAD
router.post('/', async (req,res)=>{
  const donation = await Donation.create(req.body);
  res.json(donation);
=======
router.post('/', async (req, res) => {
  try {
    const { donorName, amount, childId, childName, donorEmail, donorPhone } = req.body;
    const donationType = childId && childName ? 'sponsorship' : 'general';
    const donation = await Donation.create({
      donorName: donorName || 'Anonymous',
      amount,
      childId: childId || null,
      childName: childName || null,
      donorEmail: donorEmail || null,
      donorPhone: donorPhone || null,
      donationType
    });
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: 'Error saving donation', error });
  }
>>>>>>> 145dd94 (Updated backend to use MongoDB URI with environment variables)
});

router.get('/', async (req,res)=>{
  const data = await Donation.find();
  res.json(data);
});

module.exports = router;
