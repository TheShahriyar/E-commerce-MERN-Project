const Category = require("../models/categoryModel");

const checkCategoryExist = async (category) => {
  return Category.exists(category);
};

module.exports = checkCategoryExist;
