const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillswap/profiles', // Folder in cloudinary
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      {
        width: 500,
        height: 500,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto',
        fetch_format: 'auto'
      }
    ],
    public_id: (req, file) => {
      // Generate unique filename using user ID and timestamp
      return `profile_${req.user._id}_${Date.now()}`;
    },
  },
});

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

// Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;
  
  try {
    // Extract public ID from Cloudinary URL
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return `skillswap/profiles/${publicId}`;
  } catch (error) {
    return null;
  }
};

module.exports = {
  cloudinary,
  upload,
  deleteImage,
  extractPublicId,
};
