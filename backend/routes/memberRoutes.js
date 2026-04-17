const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const { uploadMember } = require('../config/cloudinary');

/* ── schema ── */
const memberSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  role:       { type: String, required: true },
  email:      String,
  phone:      String,
  joinedYear: String,
  bio:        { type: String, required: true },
  photo:      String,
}, { timestamps: true });

const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

/* ── GET all ── */
router.get('/', async (_req, res) => {
  try {
    res.json(await Member.find().sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── POST create ── */
router.post('/', uploadMember.single('photo'), async (req, res) => {
  try {
    const { name, role, email, phone, joinedYear, bio } = req.body;
    if (!name || !role || !bio)
      return res.status(400).json({ error: 'Name, role and bio are required.' });

    // Cloudinary URL is in req.file.path
    const photo = req.file ? req.file.path : '';
    const saved = await new Member({ name, role, email, phone, joinedYear, bio, photo }).save();
    res.status(201).json(saved);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── PUT update ── */
router.put('/:id', uploadMember.single('photo'), async (req, res) => {
  try {
    const { name, role, email, phone, joinedYear, bio } = req.body;
    const update = { name, role, email, phone, joinedYear, bio };
    if (req.file) update.photo = req.file.path; // Cloudinary URL
    const updated = await Member.findByIdAndUpdate(
      req.params.id, update, { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Member not found.' });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── DELETE ── */
router.delete('/:id', async (req, res) => {
  try {
    const m = await Member.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Member not found.' });
    res.json({ message: 'Deleted.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
