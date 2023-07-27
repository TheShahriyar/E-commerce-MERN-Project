const Category = require("../models/categoryModel");

const checkCategoryExist = async (name) => {
  return Category.exists({ name: name });
};

module.exports = checkCategoryExist;
