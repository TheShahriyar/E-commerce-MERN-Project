const { body } = require("express-validator");

// Registration validation
const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required!")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product name should be at least 3 character long"),

  body("price").trim().notEmpty().withMessage("Price is required!"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required!")
    .isLength({ min: 3 })
    .withMessage("Product description should be at least 3 character long"),

  body("quantity").trim().notEmpty().withMessage("Quantity is required!"),

  body("shipping").trim(),

  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("Product image is required");
      }
      return true;
    })
    .withMessage("Image is required!"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required!"),
];

module.exports = {
  validateProduct,
};
