const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserByID,
  handleBanUserByID,
  handleUnanUserByID,
  handleUpdatePassword,
  handleForgotPassword,
  handleResetPassword,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const {
  validateUserRegistration,
  validateConfirmPassword,
  validateUserForgotPassword,
  validateResetPassword,
} = require("../validators/auth");
const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidation,
  processRegister
);
userRouter.post("/activate", isLoggedOut, activateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id([0-9a-fA_F]{24})", isLoggedIn, getUserById);
userRouter.delete("/:id([0-9a-fA_F]{24})", isLoggedIn, deleteUserById);
userRouter.put(
  "/ban-user/:id([0-9a-fA_F]{24})",
  isLoggedIn,
  isAdmin,
  handleBanUserByID
);
userRouter.put(
  "/unban-user/:id([0-9a-fA_F]{24})",
  isLoggedIn,
  isAdmin,
  handleUnanUserByID
);
userRouter.put(
  "/update-password/:id([0-9a-fA_F]{24})",
  validateConfirmPassword,
  runValidation,
  isLoggedIn,
  handleUpdatePassword
);
userRouter.post(
  "/forgot-password",
  validateUserForgotPassword,
  runValidation,
  handleForgotPassword
);
userRouter.put(
  "/reset-password",
  validateResetPassword,
  runValidation,
  handleResetPassword
);
userRouter.put(
  "/:id([0-9a-fA_F]{24})",
  upload.single("image"),
  isLoggedIn,
  updateUserByID
);

module.exports = userRouter;
