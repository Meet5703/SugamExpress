import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const InquiryData = mongoose.model("Inquiry", inquirySchema);

export default InquiryData;
