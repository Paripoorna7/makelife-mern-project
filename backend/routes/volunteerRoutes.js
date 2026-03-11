const router   = require('express').Router();
const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  fullName:      { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String, default: '' },
  age:           { type: Number, default: null },
  occupation:    { type: String, default: '' },
  availability:  { type: String, default: 'flexible' },
  areas:         [{ type: String }],
  experience:    { type: String, default: '' },
  motivation:    { type: String, required: true },
  status:        { type: String, default: 'pending' },
  createdAt:     { type: Date, default: Date.now },
});

const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);

router.get('/', async (req, res) => {
  try {
    const list = await Volunteer.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, age, occupation, availability, areas, experience, motivation } = req.body;
    if (!fullName || !email || !motivation)
      return res.status(400).json({ error: 'Full name, email and motivation are required.' });
    const vol = await Volunteer.create({ fullName, email, phone, age: age||null, occupation, availability, areas: Array.isArray(areas)?areas:[], experience, motivation });
    console.log('New volunteer: ' + fullName);
    res.status(201).json(vol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const vol = await Volunteer.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!vol) return res.status(404).json({ error: 'Not found.' });
    res.json(vol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
