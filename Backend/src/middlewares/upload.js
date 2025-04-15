const multer = require("multer");

// Multer configuration and image validation
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB limits
    fileFilter(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        cb(null, allowedTypes.includes(file.mimetype));
    }
});

module.exports = upload;