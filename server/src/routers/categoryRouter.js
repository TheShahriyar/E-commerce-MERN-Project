const express = require("express");

const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const {
  handleCreateCategory,
  getAllCategories,
  getCategoryBySlug,
  handleDeleteCategory,
} = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");
const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  validateCategory,
  runValidation,
  handleCreateCategory
);

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:slug", getCategoryBySlug);
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategory);

module.exports = categoryRouter;
