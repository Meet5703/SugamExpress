import dbConnection from "../Models/DB.js";
import ProductData from "../Models/Schemas/ProductSchema.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createProduct = async (req, res, next) => {
  console.log(req.body); // log the body
  console.log(req.files); // log the files

  dbConnection();
  try {
    const {
      title,
      description,
      detailedDescription,
      category,
      colorOfPart,
      isFeatured,
      isExclusive,
    } = req.body;

    if (
      !title ||
      !description ||
      !req.files ||
      !req.files.photo ||
      !req.files.photos ||
      !detailedDescription ||
      !category ||
      !colorOfPart
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const photo = req.files.photo[0].path; // Save the full path of the photo
    const photos = req.files.photos.map((file) => file.path); // Save the full paths of all photos

    if (photos.length < 2) {
      return res.status(400).json({
        status: "error",
        message: "At least 2 photos are required",
      });
    }

    const newProduct = new ProductData({
      title,
      description,
      photo,
      detailedDescription,
      photos,
      category,
      isFeatured,
      isExclusive,
      colorOfPart,
    });

    await newProduct.save();

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const getAllProducts = async (req, res, next) => {
  dbConnection();
  try {
    const products = await ProductData.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getSingleProductById = async (req, res, next) => {
  dbConnection();
  try {
    const { id } = req.params;

    // Ensure id is a valid ObjectId before querying
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid product ID format",
      });
    }

    const product = await ProductData.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const updateSingleProduct = async (req, res, next) => {
  dbConnection();
  try {
    const { id } = req.params;
    const {
      title,
      description,
      detailedDescription,
      category,
      colorOfPart,
      isFeatured,
      isExclusive,
    } = req.body;

    // Fetch the existing product
    const existingProduct = await ProductData.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    const updatedFields = {
      title,
      description,
      detailedDescription,
      category,
      colorOfPart,
      isFeatured,
      isExclusive,
    };

    // Check and update the photo
    if (req.files && req.files.photo) {
      // Delete the old photo if it exists
      if (existingProduct.photo) {
        const oldPhotoPath = path.join(
          __dirname,
          "../public",
          existingProduct.photo
        );
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlink(oldPhotoPath, (err) => {
            if (err) console.error("Error deleting old photo:", err);
          });
        } else {
          console.log("Old photo not found at path:", oldPhotoPath);
        }
      }
      updatedFields.photo = req.files.photo[0].path;
    }

    // Check and update the photos
    if (req.files && req.files.photos) {
      const photos = req.files.photos.map((file) => file.path);
      if (photos.length < 2) {
        return res.status(400).json({
          status: "error",
          message: "At least 2 photos are required",
        });
      }

      // Delete the old photos if they exist
      if (existingProduct.photos && existingProduct.photos.length > 0) {
        existingProduct.photos.forEach((oldPhoto) => {
          const oldPhotoPath = path.join(__dirname, "../public", oldPhoto);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlink(oldPhotoPath, (err) => {
              if (err) console.error("Error deleting old photo:", err);
            });
          } else {
            console.log("Old photo not found at path:", oldPhotoPath);
          }
        });
      }

      updatedFields.photos = photos;
    }

    // Update the product
    const updatedProduct = await ProductData.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const getExclusiveProducts = async (req, res, next) => {
  dbConnection();
  try {
    // Fetch exclusive products based on the `isExclusive` field
    const exclusiveProducts = await ProductData.find({ isExclusive: true });
    console.log("Exclusive Products:", exclusiveProducts); // Log the fetched products for debugging

    if (!exclusiveProducts.length) {
      return res.status(404).json({
        status: "error",
        message: "No exclusive products found",
      });
    }

    res.status(200).json({
      status: "success",
      data: exclusiveProducts,
    });
  } catch (error) {
    console.error("Error fetching exclusive products:", error); // Log the error for debugging
    next(error);
  }
};

const deleteSingleProduct = async (req, res, next) => {
  dbConnection();
  try {
    const deletedProduct = await ProductData.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getFilteredProducts = async (req, res, next) => {
  dbConnection();
  try {
    const { category, colorOfPart } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (colorOfPart) filter.colorOfPart = colorOfPart;

    const products = await ProductData.find(filter);
    if (!products.length) {
      return res.status(404).json({
        status: "error",
        message: "No products found with the specified criteria",
      });
    }
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  dbConnection();
  try {
    // Assume you have a field like `isFeatured` in your schema to mark featured products
    const featuredProducts = await ProductData.find({ isFeatured: true });
    if (!featuredProducts.length) {
      return res.status(404).json({
        status: "error",
        message: "No featured products found",
      });
    }
    res.status(200).json({
      status: "success",
      data: featuredProducts,
    });
  } catch (error) {
    next(error);
  }
};

const getLatestProducts = async (req, res, next) => {
  dbConnection();
  try {
    const latestProducts = await ProductData.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(12); // Limit to 2 latest products

    if (!latestProducts.length) {
      return res.status(404).json({
        status: "error",
        message: "No latest products found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: latestProducts,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  getAllProducts,
  getSingleProductById,
  updateSingleProduct,
  deleteSingleProduct,
  getFilteredProducts,
  getFeaturedProducts,
  getLatestProducts,
  getExclusiveProducts,
};
