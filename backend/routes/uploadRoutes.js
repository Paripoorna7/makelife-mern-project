const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads');
console.log('Upload path:', uploadPath);
console.log('Folder exists:', fs.existsSync(uploadPath));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Incoming file:', file.originalname);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = /image\/(jpeg|png)/.test(file.mimetype);
  if (extValid && mimeValid) cb(null, true);
  else cb(new Error('Only JPG/PNG files allowed'));
}
});

router.post('/', upload.single('photo'), (req, res) => {
  console.log('req.file:', req.file);
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});

module.exports = router;