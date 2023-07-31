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

const handleGetProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const products = await Product.find({}, { image: 0 })
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!products) {
      throw createError(404, "Products not found");
    }

    const count = await Product.find({}).countDocuments();

    return successResponse(res, {
      statusCode: 200,
      message: "All products returned successfully!",
      payload: {
        products: products,
        pagination: {
          totalProducts: count,
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetProductBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const product = await Product.find({ slug }).populate("category").lean();

    if (!product) {
      throw createError(404, "Product not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product returned successfully!",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProductBySlug,
};
