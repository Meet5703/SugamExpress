import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  detailedDescription: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  colorOfPart: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false, // Default to not featured
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductData = mongoose.model("Product", productSchema);

export default ProductData;
