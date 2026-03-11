const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');

// ✅ POST /api/adoptions — Submit adoption application
router.post('/', async (req, res) => {
  try {
    console.log('📨 Adoption POST received:', req.body); // debug log

    const {
      childId, childName, applicantName, address,
      annualIncome, familyMembers, phone, email, reason
    } = req.body;

    // Validate all fields present
    if (!childId || !childName || !applicantName || !address ||
        annualIncome === undefined || familyMembers === undefined ||
        !phone || !email || !reason) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Block duplicate pending applications
    const existing = await Adoption.findOne({
      childId: String(childId),
      email: normalizedEmail,
      status: 'pending'
    });

    if (existing) {
      return res.status(409).json({
        error: 'You already have a pending application for this child.'
      });
    }

    const adoption = new Adoption({
      childId: String(childId),
      childName,
      applicantName,
      address,
      annualIncome: Number(annualIncome),
      familyMembers: Number(familyMembers),
      phone,
      email: normalizedEmail,
      reason
    });

    await adoption.save();
    console.log('✅ Adoption saved:', adoption._id);
    res.status(201).json({ success: true, adoption });

  } catch (err) {
    console.error('❌ Adoption save error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/adoptions — Get all adoption applications
router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.find().sort({ submittedAt: -1 });
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/adoptions/child/:childId — Get adoptions for a specific child
router.get('/child/:childId', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ childId: req.params.childId });
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/adoptions/:id — Get single adoption by ID
router.get('/:id', async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) return res.status(404).json({ error: 'Application not found.' });
    res.json(adoption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/adoptions/:id/status — Approve or reject
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const adoption = await Adoption.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!adoption) return res.status(404).json({ error: 'Application not found.' });

    // If approved, mark child as adopted
    if (status === 'approved') {
      const Child = require('../models/Child');
      await Child.findByIdAndUpdate(adoption.childId, { isAdopted: true });
    }

    res.json({ success: true, adoption });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/adoptions/:id
router.delete('/:id', async (req, res) => {
  try {
    const adoption = await Adoption.findByIdAndDelete(req.params.id);
    if (!adoption) return res.status(404).json({ error: 'Application not found.' });
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;