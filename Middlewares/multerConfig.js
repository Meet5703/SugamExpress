import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/photos"); // Destination folder where files will be stored
  },
  filename: function (req, file, cb) {
    // Generate unique file name with timestamp and original file extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter to allow only certain file types
const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept image files
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize Multer instance with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
