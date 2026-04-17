const router = require('express').Router();
const mongoose = require('mongoose');

const founderStorySchema = new mongoose.Schema({
  title:    { type: String, default: 'Our Founder\'s Story' },
  content:  { type: String, default: '' },
  photo:    { type: String, default: '' },
  updatedAt:{ type: Date,   default: Date.now }
});

const FounderStory = mongoose.models.FounderStory || mongoose.model('FounderStory', founderStorySchema);

// GET founder story
router.get('/', async (req, res) => {
  try {
    let story = await FounderStory.findOne();
    if (!story) story = await FounderStory.create({});
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update founder story
router.put('/', async (req, res) => {
  try {
    let story = await FounderStory.findOne();
    if (!story) {
      story = await FounderStory.create(req.body);
    } else {
      Object.assign(story, req.body, { updatedAt: new Date() });
      await story.save();
    }
    res.json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
