// Inquiry.js (Router)

import express from "express";
import { createInquiry, getAllProducts } from "../Controllers/Inquiry.js";

const router = express.Router();

router.post("/create", createInquiry);
router.get("/getall", getAllProducts);

export default router;
