const express = require("express");

const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const {
  handleCreateCategory,
  getAllCategories,
  getCategoryBySlug,
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

module.exports = categoryRouter;
