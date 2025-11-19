import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

// CREATE Product
export const createProduct = async (req, res) => {
  try {
    const { title, description, category, detailsContent } = req.body;

    const newProduct = await Product.create({
      title,
      description,
      category,
      detailsContent,
      productImage: req.file ? req.file.filename : null,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // If new file uploaded, delete old image
    if (req.file && product.productImage) {
      const oldFilePath = path.join(process.cwd(), "uploads", product.productImage);
      fs.unlink(oldFilePath, (err) => {
        if (err) console.log("Failed to delete old image:", err);
      });
    }

    // Update product
    const updateData = {
      ...req.body,
      productImage: req.file ? req.file.filename : product.productImage,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image file from uploads
    if (product.productImage) {
      const filePath = path.join(process.cwd(), "uploads", product.productImage);
      fs.unlink(filePath, (err) => {
        if (err) console.log("Failed to delete image:", err);
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
