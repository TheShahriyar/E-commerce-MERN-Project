const createError = require("http-errors");
const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const { createCategory } = require("../services/cetegoryService");
const checkCategoryExist = require("../helper/checkCategoryExist");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newCategory = await createCategory(name);

    // const categoryExist = await Category.exists({
    //   name: newCategory.name
    // });
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
    const categories = await Category.find();

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
    const slug = req.params.slug;
    const option = {
      slug: slug,
    };

    const category = await Category.findOne(option);
    if (!category) {
      throw createError(404, `Category doesn't exist`);
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Category returned successfully`,
      payload: { category },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateCategory, getAllCategories, getCategoryBySlug };
