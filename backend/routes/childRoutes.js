const express = require('express');
const router  = express.Router();
const Child   = require('../models/Child');
const { uploadGeneral, getFileUrl } = require('../config/cloudinary');

/* GET all children */
router.get('/', async (req, res) => {
  try {
    res.json(await Child.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* POST — add child with optional photo upload */
router.post('/', uploadGeneral.single('photo'), async (req, res) => {
  try {
    const { name, age, gender, story } = req.body;
    const photo = req.file ? getFileUrl(req.file) : (req.body.photo || '');
    const child = new Child({ name, age: Number(age), gender: gender || '', story, photo });
    await child.save();
    res.json(child);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* PUT — update child with optional new photo */
router.put('/:id', uploadGeneral.single('photo'), async (req, res) => {
  try {
    const { name, age, gender, story } = req.body;
    const update = { name, age: Number(age), gender: gender || '', story };
    if (req.file)        update.photo = getFileUrl(req.file);
    else if (req.body.photo) update.photo = req.body.photo;
    const updated = await Child.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ error: 'Child not found.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* DELETE child */
router.delete('/:id', async (req, res) => {
  try {
    await Child.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
