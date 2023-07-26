const { body } = require("express-validator");

// Registration validation
const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required!")
    .isLength({ min: 3 })
    .withMessage("Category Name should be at least 3 character long"),
];

module.exports = {
  validateCategory,
};
