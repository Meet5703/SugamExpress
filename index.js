import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./Routes/Product.js";
import inquiryRoutes from "./Routes/Inquiry.js";
import dbConnection from "./Models/DB.js";
import nodemailer from "nodemailer";

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/public/photos",
  express.static(path.join(__dirname, "public/photos"))
);

// Database connection
dbConnection();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sureshkhetani1111@gmail.com",
    pass: "aura cccz ppjk mzkp",
  },
});

// Routes setup
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/inquiry", inquiryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { transporter };
