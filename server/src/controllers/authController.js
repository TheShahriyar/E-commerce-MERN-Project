const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, clientURL, jwtRefreshKey } = require("../secret");
const { emailWithNodeMailer } = require("../helper/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login Controller
const handleLogin = async (req, res, next) => {
  try {
    //Email and Password from req.body
    const { email, password } = req.body;

    // Check isExist
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User doesn't exist with this email");
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Email/Password didn't match");
    }

    // is Banner
    if (user.isBanned) {
      throw createError(403, "You are Banner! Please contact authority");
    }

    // Access Token, Cookie
    const accessToken = createJSONWebToken({ user }, jwtAccessKey, "15m");

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 min
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    // Refresh Token, Cookie
    const refreshToken = createJSONWebToken({ user }, jwtRefreshKey, "7d");

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully!",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

// Logout Controller
const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
    if (!decodedToken) {
      throw createError(401, "Invalid refresh token");
    }

    const accessToken = createJSONWebToken(
      decodedToken.user,
      jwtAccessKey,
      "15m"
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 min
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "New Access Token Generated!",
    });
  } catch (error) {
    next(error);
  }
};

const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    const decodedToken = jwt.verify(accessToken, jwtAccessKey);
    if (!decodedToken) {
      throw createError(401, "Invalid Access Token!  Please login again.");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Protected successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
