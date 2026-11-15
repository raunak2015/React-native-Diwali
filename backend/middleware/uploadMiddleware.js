const path = require('path');
const fs = require('fs');

// Storage configuration for uploaded property and avatar images
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory/Disk storage mock handler for multi-part file uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are permitted'));
  }
};

const handleUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      status: 'fail',
      message: err.message || 'File upload failed',
    });
  }
  next();
};

module.exports = {
  uploadsDir,
  fileFilter,
  handleUploadError,
};
