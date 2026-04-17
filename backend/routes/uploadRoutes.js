const express = require('express');
const router  = express.Router();
const { uploadGeneral } = require('../config/cloudinary');

// POST /api/upload — upload a single image to Cloudinary
router.post('/', uploadGeneral.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  // Cloudinary returns the URL in req.file.path
  res.json({ url: req.file.path });
});

module.exports = router;
