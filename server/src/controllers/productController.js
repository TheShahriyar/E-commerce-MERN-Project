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
    const product = await Product.findOne({ slug }).populate("category").lean();

    if (!product) {
      throw createError(404, "Product not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product returned successfully!",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteProduct = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const deletedProduct = await Product.findOneAndDelete({ slug });

    if (!deletedProduct) {
      throw createError(404, "Product not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product deleted successfully!",
      payload: { deletedProduct },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateProduct = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    const allowedFields = [
      "name",
      "description",
      "price",
      "quantity",
      "shipping",
    ];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    if (updates.name) {
      updates.slug = slugify(updates.name.toLowerCase());
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(
          "image size is too large. Size should not be  greater than 2MB"
        );
      }
      updates.image = image.buffer.toString("base64");
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      updates,
      updateOptions
    );

    if (!updatedProduct) {
      throw createError(404, "Product isn't exist");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product updated successfully",
      payload: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProductBySlug,
  handleDeleteProduct,
  handleUpdateProduct,
};
