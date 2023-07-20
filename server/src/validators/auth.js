const {body} = require('express-validator')


// Registration validation
const validateUserRegistration = [
  body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required!")
  .isLength({min:3, max: 31})
  .withMessage("Name should be at least 3-31 character long"),
  
  body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required!")
  .isEmail()
  .withMessage("Invalid Email"),

  body("password")
  .trim()
  .notEmpty()
  .withMessage("Password is required!")
  .isLength({min:6})
  .withMessage("Password should be at least 6 character long")
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/)
  .withMessage("Password should be at least a uppercase, lowercase, symbol and number"),

  body("address")
  .trim()
  .notEmpty()
  .withMessage("Address is required!")
  .isLength({min:3})
  .withMessage("Address should be at least 3 character long"),

  body("phone")
  .trim()
  .notEmpty()
  .withMessage("Phone is required!"),

  body("image")
  .custom((value, {req}) => {
    if (!req.file || !req.file.buffer) {
      throw new Error('User image is required');
    }
    return true;
  })
  .withMessage("Image is required!")
]


// Login Validation
const validateUserLogin = [
  
  body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required!")
  .isEmail()
  .withMessage("Invalid Email"),

  body("password")
  .trim()
  .notEmpty()
  .withMessage("Password is required!")
  .isLength({min:6})
  .withMessage("Password should be at least 6 character long")
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/)
  .withMessage("Password should be at least a uppercase, lowercase, symbol and number")

]


// Confirm Password Validation
const validateConfirmPassword = [

  body("oldPassword")
  .trim()
  .notEmpty()
  .withMessage("OldPassword is required!")
  .isLength({min:6})
  .withMessage("Old Password should be at least 6 character long")
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/)
  .withMessage("Password should be at least a uppercase, lowercase, symbol and number"),

  body("newPassword")
  .trim()
  .notEmpty()
  .withMessage("New Password is required!")
  .isLength({min:6})
  .withMessage("New Password should be at least 6 character long")
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/)
  .withMessage("Password should be at least a uppercase, lowercase, symbol and number"),

  body('confirmPassword').custom((value, {req}) => {
    if(value !== req.body.newPassword) {
      throw new Error("Passowrd didn't match")
    }
    return true;
  })

]

// Login Validation
const validateUserForgotPassword = [
  
  body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required!")
  .isEmail()
  .withMessage("Invalid Email")

]

const validateResetPassword = [
  
  body("token")
  .trim()
  .notEmpty()
  .withMessage("Token is missing!"),

  body("newPassword")
  .trim()
  .notEmpty()
  .withMessage("New Password is required!")
  .isLength({min:6})
  .withMessage("New Password should be at least 6 character long")
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/)
  .withMessage("Password should be at least a uppercase, lowercase, symbol and number"),

  body('confirmPassword').custom((value, {req}) => {
    if(value !== req.body.newPassword) {
      throw new Error("Passowrd didn't match")
    }
    return true;
  })

]


module.exports = {validateUserRegistration, validateUserLogin, validateConfirmPassword, validateUserForgotPassword, validateResetPassword}