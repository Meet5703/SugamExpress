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
  getExclusiveProducts,
} from "../Controllers/Product.js";
import upload from "../Middlewares/multerConfig.js";

const router = express.Router();

router.post("/create", upload, createProduct);
router.get("/getall", getAllProducts);
router.get("/latest", getLatestProducts); // Ensure /latest route is defined before dynamic routes
router.get("/filter", getFilteredProducts);
router.get("/featured", getFeaturedProducts);
router.get("/exclusive", getExclusiveProducts);
router.get("/:id", getSingleProductById);
router.put("/:id", upload, updateSingleProduct);
router.delete("/:id", deleteSingleProduct);

export default router;
