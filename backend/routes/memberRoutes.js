const express  = require('express');
const router   = express.Router();
const Member   = require('../models/Member');
const { uploadMember, getFileUrl } = require('../config/cloudinary');

/* GET all members */
router.get('/', async (_req, res) => {
  try {
    res.json(await Member.find().sort({ sortOrder: 1, createdAt: 1 }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* POST — create member with optional photo */
router.post('/', uploadMember.single('photo'), async (req, res) => {
  try {
    const { name, role, email, phone, joinedYear, bio } = req.body;
    if (!name || !role || !bio)
      return res.status(400).json({ error: 'Name, role and bio are required.' });
    const photo = req.file ? getFileUrl(req.file) : '';
    const saved = await new Member({ name, role, email, phone, joinedYear, bio, photo }).save();
    res.status(201).json(saved);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* PUT — update member with optional new photo */
router.put('/:id', uploadMember.single('photo'), async (req, res) => {
  try {
    const { name, role, email, phone, joinedYear, bio, sortOrder } = req.body;
    const update = { name, role, email, phone, joinedYear, bio };
    if (sortOrder !== undefined && sortOrder !== '') update.sortOrder = Number(sortOrder);
    if (req.file) update.photo = getFileUrl(req.file);
    else if (req.body.photo) update.photo = req.body.photo;
    const updated = await Member.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ error: 'Member not found.' });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* PATCH — partial update (e.g. sortOrder) */
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Member not found.' });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* DELETE member */
router.delete('/:id', async (req, res) => {
  try {
    const m = await Member.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Member not found.' });
    res.json({ message: 'Deleted.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
