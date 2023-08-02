const express = require("express");
const upload = require("../middlewares/uploadFile");

const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const {
  handleCreateProduct,
  handleGetProducts,
  handleGetProductBySlug,
  handleDeleteProduct,
  handleUpdateProduct,
} = require("../controllers/productController");
const { validateProduct } = require("../validators/product");
const productRouter = express.Router();

// Create Product
productRouter.post(
  "/",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  validateProduct,
  runValidation,
  handleCreateProduct
);

// Get ALl Products
productRouter.get("/", handleGetProducts);

// Get Single product
productRouter.get("/:slug", handleGetProductBySlug);

// Delete product
productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct);

// Update product
productRouter.put(
  "/:slug",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  handleUpdateProduct
);

module.exports = productRouter;
