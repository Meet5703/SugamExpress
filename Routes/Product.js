import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProductById,
  updateSingleProduct,
  deleteSingleProduct,
  getFilteredProducts,
  getFeaturedProducts,
  getLatestProducts,
} from "../Controllers/Product.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/photos"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const cpUpload = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "photos", maxCount: 10 },
]);

router.post("/create", cpUpload, createProduct);
router.get("/getall", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/latest", getLatestProducts);
router.get("/:id", getSingleProductById);
router.put("/:id", cpUpload, updateSingleProduct);
router.delete("/:id", deleteSingleProduct);
router.get("/filter", getFilteredProducts);

export default router;
