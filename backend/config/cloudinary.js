const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for general uploads (children photos, slideshow, founder story, etc.)
const generalStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'makelife/general',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  },
});

// Storage for member profile photos
const memberStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'makelife/members',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 600, height: 600, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

const uploadGeneral = multer({
  storage: generalStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadMember = multer({
  storage: memberStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/**
 * getFileUrl(req.file)
 * multer-storage-cloudinary stores the Cloudinary URL in req.file.path.
 * This helper also checks req.file.secure_url as a fallback (some versions differ).
 */
const getFileUrl = (file) => {
  if (!file) return '';
  return file.path || file.secure_url || '';
};

module.exports = { cloudinary, uploadGeneral, uploadMember, getFileUrl };
