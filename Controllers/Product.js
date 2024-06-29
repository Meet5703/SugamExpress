import dbConnection from "../Models/DB.js";
import ProductData from "../Models/Schemas/ProductSchema.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import upload from "../Middlewares/multerConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createProduct = async (req, res, next) => {
  dbConnection();
  try {
    const {
      title,
      description,
      detailedDescription,
      category,
      colorOfPart,
      isFeatured,
    } = req.body;

    if (
      !title ||
      !description ||
      !req.files ||
      !detailedDescription ||
      !req.files.photos ||
      !category ||
      !colorOfPart
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    // Middleware usage with upload.array('photos') for handling multiple files
    upload.array("photos")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(500).json({
          status: "error",
          message: "Error uploading files",
        });
      } else if (err) {
        // An unknown error occurred
        return res.status(500).json({
          status: "error",
          message: "An unknown error occurred",
        });
      }

      const photo = req.files.photo[0].path; // Assuming this is the path to the main photo
      const photos = req.files.photos.map((file) => file.path); // Paths to additional photos

      // Transform paths to URLs accessible from the client
      const photoURL = `https://sugamexpress.onrender.com/${photo}`;
      const photosURLs = photos.map(
        (path) => `https://sugamexpress.onrender.com/${path}`
      );

      if (photos.length < 2) {
        return res.status(400).json({
          status: "error",
          message: "At least 2 photos are required",
        });
      }

      const newProduct = new ProductData({
        title,
        description,
        photo: photoURL, // Store photo URL instead of path
        detailedDescription,
        photos: photosURLs, // Store photos URLs instead of paths
        category,
        isFeatured,
        colorOfPart,
      });

      await newProduct.save();

      res.status(201).json({
        status: "success",
        message: "Product created successfully",
      });
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
    const product = await ProductData.findById(req.params.id);
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
    const { title, description, detailedDescription, category, colorOfPart } =
      req.body;

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
    };

    // Check and update the main photo
    if (req.file) {
      // Delete the old main photo
      if (existingProduct.photo) {
        const oldPhotoPath = path.join(__dirname, "../", existingProduct.photo);
        fs.unlink(oldPhotoPath, (err) => {
          if (err) console.error("Error deleting old photo:", err);
        });
      }
      updatedFields.photo = req.file.path;
    }

    // Check and update additional photos
    if (req.files && req.files.photos) {
      const photos = req.files.photos.map((file) => file.path);
      if (photos.length < 2) {
        return res.status(400).json({
          status: "error",
          message: "At least 2 photos are required",
        });
      }

      // Delete the old photos
      if (existingProduct.photos && existingProduct.photos.length > 0) {
        existingProduct.photos.forEach((oldPhoto) => {
          const oldPhotoPath = path.join(__dirname, "../", oldPhoto);
          fs.unlink(oldPhotoPath, (err) => {
            if (err) console.error("Error deleting old photo:", err);
          });
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
      .limit(2); // Limit to 2 latest products

    if (!latestProducts.length) {
      return res.status(404).json({
        status: "error",
        message: "No latest products found",
      });
    }

    res.status(200).json({
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
};
