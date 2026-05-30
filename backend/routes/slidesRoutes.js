const router   = require('express').Router();
const mongoose = require('mongoose');
const { uploadGeneral, getFileUrl } = require('../config/cloudinary');

const slideSchema = new mongoose.Schema({
  url:       { type: String, required: true },
  order:     { type: Number, default: 0 },
  createdAt: { type: Date,   default: Date.now },
});
const Slide = mongoose.models.Slide || mongoose.model('Slide', slideSchema);

/* GET all slides */
router.get('/', async (req, res) => {
  try {
    const slides = await Slide.find().sort({ order: 1, createdAt: -1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* POST — upload image to Cloudinary, save URL in MongoDB */
router.post('/', uploadGeneral.single('photo'), async (req, res) => {
  try {
    const url = req.file ? getFileUrl(req.file) : req.body.url;
    if (!url) return res.status(400).json({ error: 'No image provided.' });
    const slide = await Slide.create({ url, order: req.body.order || 0 });
    res.status(201).json(slide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* DELETE slide */
router.delete('/:id', async (req, res) => {
  try {
    await Slide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
