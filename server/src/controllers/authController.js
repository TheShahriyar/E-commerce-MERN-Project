const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const deleteImage = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtAccessKey, clientURL } = require('../secret');
const { emailWithNodeMailer } = require('../helper/email');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



// Login Controller
const handleLogin = async (req, res, next) => {
  try {
    
    //Email and Password from req.body
    const {email, password} = req.body;

    // Check isExist
    const user = await User.findOne({email})
    if (!user) {
      throw createError(404, "User doesn't exist with this email")
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      throw createError(401, "Email/Password didn't match")
    }

    // is Banner
    if (user.isBanned) {
      throw createError(403, "You are Banner! Please contact authority")
    }

    // Token, Cookie
    const accessToken = createJSONWebToken({ user }, jwtAccessKey, '15m');

    res.cookie('accessToken', accessToken, {
      maxAge: 15 * 60 * 1000, // 15 min
      httpOnly: true,
      // secure: true,
      sameSite: 'none'
    })

    const userWithoutPassword = await User.findOne({email}).select('-password')

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully!",
      payload: { userWithoutPassword }
    })
  } catch (error) {
    next(error)
  }
}

// Logout Controller
const handleLogout = async (req, res, next) => {
  try {
    
    res.clearCookie('accessToken');

    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully!"
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {handleLogin, handleLogout}