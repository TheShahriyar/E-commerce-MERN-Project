const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { jwtAccessKey } = require('../secret');


const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw createError(401, "Access Token not found! Please login")
    }

    const decoded = jwt.verify(token, jwtAccessKey);
    if (!decoded) {
      throw createError(401, "Invalid access token. Please login")
    }

    req.body.userId = decoded._id

    next()

  } catch (error) {
    return next(error)
  }
}

module.exports = {isLoggedIn}