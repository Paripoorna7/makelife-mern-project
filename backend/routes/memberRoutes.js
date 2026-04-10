const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const path       = require('path');
const fs         = require('fs');
const mongoose   = require('mongoose');

/* ── uploads dir ── */
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

/* ── multer ── */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename:    (_req, file, cb) =>
    cb(null, `member_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

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
router.post('/', (req, res) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    try {
      console.log('BODY:', req.body);
      console.log('FILE:', req.file);
      const { name, role, email, phone, joinedYear, bio } = req.body;
      if (!name || !role || !bio)
        return res.status(400).json({ error: 'Name, role and bio are required.' });
      const photo = req.file ? `/uploads/${req.file.filename}` : '';
      const saved = await new Member({ name, role, email, phone, joinedYear, bio, photo }).save();
      console.log('Saved member:', saved._id);
      res.status(201).json(saved);
    } catch (e) {
      console.error('POST member error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });
});

/* ── PUT update ── */
router.put('/:id', (req, res) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    try {
      const { name, role, email, phone, joinedYear, bio } = req.body;
      const update = { name, role, email, phone, joinedYear, bio };
      if (req.file) update.photo = `/uploads/${req.file.filename}`;
      const updated = await Member.findByIdAndUpdate(
        req.params.id, update, { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Member not found.' });
      res.json(updated);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
});

/* ── DELETE ── */
router.delete('/:id', async (req, res) => {
  try {
    const m = await Member.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Member not found.' });
    if (m.photo?.startsWith('/uploads/')) {
      const fp = path.join(__dirname, '..', m.photo);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.json({ message: 'Deleted.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;