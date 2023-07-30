const createError = require("http-errors");
const { successResponse } = require("./responseController");
const Product = require("../models/productModel");
const slugify = require("slugify");

const handleCreateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;

    const image = req.file;
    if (!image) {
      throw createError(400, "image is required");
    }
    if (image.size > 1024 * 1024 * 2) {
      throw createError(
        "image size is too large. Size should not be  greater than 2MB"
      );
    }

    const imageBufferString = image.buffer.toString("base64");

    const productExist = await Product.exists({ name });

    if (productExist) {
      throw createError(409, "Product already exist.");
    }

    const product = await Product.create({
      name: name,
      slug: slugify(name.toLowerCase()),
      description: description,
      price: price,
      quantity: quantity,
      shipping: shipping,
      image: imageBufferString,
      category: category,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Product is created successfully!",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateProduct };
