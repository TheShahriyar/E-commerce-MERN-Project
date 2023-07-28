const createError = require("http-errors");
const slugify = require("slugify");
const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const {
  createCategory,
  getCategories,
  updateCategory,
} = require("../services/cetegoryService");
const checkCategoryExist = require("../helper/checkCategoryExist");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newCategory = await createCategory(name);

    // const categoryExist = await Category.exists({
    //   name: name,
    // });
    // if (categoryExist) {
    //   throw createError(409, "Category already exist.");
    // }

    // const categoryExist = await checkCategoryExist(name);
    // if (categoryExist) {
    //   throw createError(409, "Category already exist.");
    // }

    return successResponse(res, {
      statusCode: 200,
      message: `Category created successfully`,
      payload: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();

    return successResponse(res, {
      statusCode: 200,
      message: `All categories returned successfully`,
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.find({ slug }).select("name slug").lean();
    if (!category) {
      throw createError(404, `Category doesn't exist`);
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Category returned successfully`,
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteCategory = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const option = {
      slug: slug,
    };
    // const category = await Category.findOne(option);

    const deleteCategory = await Category.findOneAndDelete(option);
    if (!deleteCategory) {
      throw createError(400, "Category not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Category deleted successfully`,
      payload: deleteCategory,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;

    const updatedCategory = await updateCategory(name, slug);
    if (!updateCategory) {
      throw createError(404, "Category not found!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Category Updated successfully`,
      payload: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCategory,
  getAllCategories,
  getCategoryBySlug,
  handleDeleteCategory,
  handleUpdateCategory,
};
