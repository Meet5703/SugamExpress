// Inquiry.js (Controller)

import { transporter } from "../index.js"; // Import the transporter from index.js
import InquiryData from "../Models/Schemas/Inquiries.js";

const createInquiry = async (req, res, next) => {
  try {
    const { productName, name, email, number, message } = req.body;

    if (!productName || !name || !email || !number || !message) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const newInquiry = new InquiryData({
      productName,
      name,
      email,
      number,
      message,
    });

    await newInquiry.save();

    // Send email notification
    const mailOptions = {
      from: "sureshkhetani1111@gmail.com", // Your Gmail address
      to: "sureshkhetani1111@gmail.com", // Admin's email address
      subject: "New Inquiry",
      text: `New inquiry received:\n\nProduct Name: ${productName}\nName: ${name}\nEmail: ${email}\nNumber: ${number}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry sent successfully",
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
  try {
    const products = await InquiryData.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export { createInquiry, getAllProducts };
