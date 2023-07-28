const slugify = require("slugify");
const Category = require("../models/categoryModel");

const createCategory = async (name) => {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name.toLowerCase()),
  });

  return newCategory;
};

const getCategories = async () => {
  return await Category.find({}).select("name slug").lean();
};

const updateCategory = async (name, slug) => {
  const updatedSlug = slugify(name.toLowerCase());

  const filter = { slug };
  const updateOptions = { new: true };
  let updates = { $set: { name: name, slug: updatedSlug } };

  const updateCategory = await Category.findOneAndUpdate({
    filter,
    updates,
    updateOptions,
  });

  return updateCategory;
};

module.exports = { createCategory, getCategories, updateCategory };
