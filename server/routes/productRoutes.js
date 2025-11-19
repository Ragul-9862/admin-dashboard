import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("productImage"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", upload.single("productImage"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
