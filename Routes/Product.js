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
import upload from "../Middlewares/multerConfig.js"; // Import the upload middleware

const router = express.Router();

router.post("/create", upload, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProductById);
router.put("/:id", upload, updateSingleProduct);
router.delete("/:id", deleteSingleProduct);
router.get("/filter", getFilteredProducts);
router.get("/featured", getFeaturedProducts);
router.get("/latest", getLatestProducts);

export default router;
