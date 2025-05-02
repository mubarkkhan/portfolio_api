const multer = require("multer");
const path = require("path");

// Configure the storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Set the destination folder
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${timestamp}-${basename}${ext}`);
  },
});

// Define allowed file types (images, videos, pdf, etc.)
const filetypes = /jpeg|jpg|png|gif|webp|avif|pdf|mp4|mp3|txt|doc|docx/; // Add more formats as needed

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validate the file type
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // Accept the file
    } else {
      cb(
        {
          message:
            "File format not supported, please upload a valid file (e.g., jpeg, png, pdf, mp4, etc.).",
        },
        false
      ); // Reject unsupported file formats
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // Limit file size to 20MB per file
  },
});

module.exports = {
  upload,
};
