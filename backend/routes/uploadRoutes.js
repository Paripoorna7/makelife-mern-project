const express = require('express');
const router  = express.Router();
const { uploadGeneral, getFileUrl } = require('../config/cloudinary');

// POST /api/upload — upload a single image to Cloudinary, return its URL
router.post('/', uploadGeneral.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = getFileUrl(req.file);
  if (!url) return res.status(500).json({ message: 'Cloudinary did not return a URL' });
  res.json({ url });
});

module.exports = router;
