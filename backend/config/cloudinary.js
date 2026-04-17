const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for general uploads (children photos, slideshow, etc.)
const generalStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'makelife/general',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  },
});

// Storage for member profile photos
const memberStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'makelife/members',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 600, height: 600, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

const uploadGeneral = multer({
  storage: generalStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadMember = multer({
  storage: memberStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { cloudinary, uploadGeneral, uploadMember };
