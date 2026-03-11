const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');

// ── Load or redefine Child model ──────────────────────────────────────────────
// Uses existing model if already compiled, otherwise defines it here.
// Gender enum is intentionally permissive to support 'male'/'female'/'Boy'/'Girl' etc.
let Child;
try {
  // Try loading existing model file — if it exists, use it
  Child = require('../models/Child');
} catch {
  // Model file not found — define inline
}

// Always redefine schema with permissive gender to fix enum mismatch
const childSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  age:            { type: Number, required: true },
  gender:         { type: String, default: '' },   // NO enum restriction — accepts 'male','female','Boy','Girl',''
  photo:          { type: String, default: '' },
  story:          { type: String, default: '' },
  healthStatus:   { type: String, default: '' },
  educationLevel: { type: String, default: '' },
  isAdopted:      { type: Boolean, default: false },
}, { timestamps: true, strict: false });   // strict:false allows extra fields from existing docs

// Safe model registration — never throws "Cannot overwrite model" error
if (mongoose.models.Child) {
  // Patch the existing model's schema to remove gender enum restriction
  delete mongoose.models.Child;
}
Child = mongoose.model('Child', childSchema);


// ── GET all children ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const children = await Child.find().sort({ createdAt: -1 });
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET single child ─────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) return res.status(404).json({ error: 'Child not found' });
    res.json(child);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST create child ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const child = new Child(req.body);
    await child.save();
    res.status(201).json(child);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PATCH update specific fields (e.g. gender) ───────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Child.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: false }   // runValidators:false bypasses enum restriction
    );
    if (!updated) return res.status(404).json({ error: 'Child not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT replace entire child document ───────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const updated = await Child.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: false }
    );
    if (!updated) return res.status(404).json({ error: 'Child not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE child ─────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Child.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Child not found' });
    res.json({ message: 'Child deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;