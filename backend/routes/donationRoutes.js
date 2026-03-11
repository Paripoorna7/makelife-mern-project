const router = require('express').Router();
const Donation = require('../models/Donation');

router.post('/', async (req, res) => {
  try {
    const { donorName, amount, childId, childName } = req.body;
    const donationType = childId && childName ? 'sponsorship' : 'general';
    const donation = await Donation.create({
      donorName: donorName || 'Anonymous',
      amount,
      childId: childId || null,
      childName: childName || null,
      donationType
    });
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: 'Error saving donation', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await Donation.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error });
  }
});

module.exports = router;


