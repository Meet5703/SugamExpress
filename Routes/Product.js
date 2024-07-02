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
import cpUpload from "../Middlewares/multerConfig.js";

const router = express.Router();

router.post("/create", cpUpload, createProduct);
router.get("/getall", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/latest", getLatestProducts);
router.get("/:id", getSingleProductById);
router.put("/:id", cpUpload, updateSingleProduct);
router.delete("/:id", deleteSingleProduct);
router.get("/filter", getFilteredProducts);

export default router;
