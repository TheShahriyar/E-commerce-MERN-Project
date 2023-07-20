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
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUserByID);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnanUserByID);
userRouter.put(
  "/update-password/:id",
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
userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUserByID);

module.exports = userRouter;
