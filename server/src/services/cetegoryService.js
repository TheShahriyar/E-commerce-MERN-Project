const slugify = require("slugify");
const Category = require("../models/categoryModel");

const createCategory = async (name) => {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name.toLowerCase()),
  });

  return newCategory;
};

module.exports = { createCategory };
