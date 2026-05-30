const router   = require('express').Router();
const mongoose = require('mongoose');
const { uploadGeneral, getFileUrl } = require('../config/cloudinary');

const founderStorySchema = new mongoose.Schema({
  founderName:  { type: String, default: '' },
  founderRole:  { type: String, default: '' },
  founderBio:   { type: String, default: '' },
  founderPhoto: { type: String, default: '' },
  story1:       { type: String, default: '' },
  story2:       { type: String, default: '' },
  story3:       { type: String, default: '' },
  updatedAt:    { type: Date,   default: Date.now },
});
const FounderStory =
  mongoose.models.FounderStory || mongoose.model('FounderStory', founderStorySchema);

/* GET founder story */
router.get('/', async (req, res) => {
  try {
    let story = await FounderStory.findOne();
    if (!story) story = await FounderStory.create({});
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PUT — update founder story with optional photo */
router.put('/', uploadGeneral.single('photo'), async (req, res) => {
  try {
    const update = { ...req.body, updatedAt: new Date() };
    if (req.file) update.founderPhoto = getFileUrl(req.file);
    let story = await FounderStory.findOne();
    if (!story) {
      story = await FounderStory.create(update);
    } else {
      Object.assign(story, update);
      await story.save();
    }
    res.json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* POST — alias for PUT */
router.post('/', uploadGeneral.single('photo'), async (req, res) => {
  try {
    const update = { ...req.body, updatedAt: new Date() };
    if (req.file) update.founderPhoto = getFileUrl(req.file);
    let story = await FounderStory.findOne();
    if (!story) {
      story = await FounderStory.create(update);
    } else {
      Object.assign(story, update);
      await story.save();
    }
    res.json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
