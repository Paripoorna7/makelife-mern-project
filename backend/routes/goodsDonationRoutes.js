const express = require('express');
const router = express.Router();
const GoodsDonation = require('../models/GoodsDonation');

// Create a new goods donation
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    
    // Remove empty strings so they don't bloat MongoDB
    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] === null) {
        delete payload[key];
      }
    });

    payload.status = 'pending';
    const donation = await GoodsDonation.create(payload);
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: 'Error saving goods donation', error });
  }
});

// Get all goods donations (for admin)
router.get('/', async (req, res) => {
  try {
    const donations = await GoodsDonation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goods donations', error });
  }
});

// Update goods donation status (for admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await GoodsDonation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating goods donation status', error });
  }
});

module.exports = router;
