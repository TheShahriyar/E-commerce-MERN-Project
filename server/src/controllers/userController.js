const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const deleteImage = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtSecretKey, clientURL } = require('../secret');
const { emailWithNodeMailer } = require('../helper/email');
const jwt = require('jsonwebtoken')
const fs = require('fs').promises;



const getUsers = async (req, res, next)=> {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const searchRegEx = new RegExp('.*' + search + '.*', 'i')
    const filter = {
      isAdmin: {$ne: true},
      $or: [
        {name: {$regex: searchRegEx}},
        {email: {$regex: searchRegEx}},
        {phone: {$regex: searchRegEx}},
        {address: {$regex: searchRegEx}},
      ]
    }

    const options = {password: 0}

    const users = await User.find(filter, options).limit(limit).skip((page-1) * limit);

    const count = await User.find(filter).countDocuments();

    if(!users) throw createError(404, 'Users not found');

    return successResponse(res, {
      statusCode: 200,
      message: "User's profile returned successfully",
      payload: {
        users: users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page-1 > 0 ? page-1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        }
      }
    })
  } catch (error) {
    next(error)
  }
}


const getUserById = async (req, res, next)=> {
  try {

    const id = req.params.id;
    const options = {password: 0}
    const user = await findWithId(User,id, options)
    return successResponse(res, {
      statusCode: 200,
      message: "User profile returned successfully",
      payload: {user}
    })
  } catch (error) {
    next(error)
  }
}

const deleteUserById = async (req, res, next)=> {
  try {

    const id = req.params.id;
    const options = {password: 0}
    const user = await findWithId(User, id, options)

    const imagePath = user.image

    await deleteImage(imagePath)
    
    await User.findByIdAndDelete({_id: id, isAdmin: false})

    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
      payload: {user}
    })
  } catch (error) {
    next(error)
  }
}


const updateUserByID = async (req, res, next)=> {
  try {

    const userId = req.params.id;
    await findWithId( User, userId )
    const updateOptions = {new: true, runValidators: true, context: 'query'};

    let updates = {}

    // if  (req.body.name)  {
    //   updates.name = req.body.name;
    // }
    // if  (req.body.password)  {
    //   updates.name = req.body.password;
    // }
    // if  (req.body.phone)  {
    //   updates.name = req.body.phone;
    // }
    // if  (req.body.address)  {
    //   updates.name = req.body.address;
    // }

    for (let key in req.body) {
      if(['name', 'password', 'phone', 'address'].includes(key)) {
        updates[key] = req.body[key]
      }
    }

    const image = req.file;
    if(image) {
      if(image.size > (1024*1024*2)) {
        throw createError("image size is too large. Size should not be  greater than 2MB")
      }
      updates.image = image.buffer.toString('base64')
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");

    if(!updatedUser) {
      throw createError(404, "User isn't exist")
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully",
      payload: updatedUser
    })
  } catch (error) {
    next(error)
  }
}


const processRegister = async (req, res, next)=> {
  try {

    const { name, email, password, phone, address } = req.body;

    const image = req.file;
    if(!image) {
      throw createError(400, "image is required")
    }
    if(image.size > (1024*1024*2)) {
      throw createError("image size is too large. Size should not be  greater than 2MB")
    }

    const imageBufferString = image.buffer.toString('base64');

    const userExist = await User.exists({email: email});

    if(userExist) {
      throw createError(409, "User already exist with this email.")
    }

    // Create JWT
    const token = createJSONWebToken({name, email, password, phone, address}, jwtSecretKey, '10m');

    // Prepare Email
    const emailData = {
      email,
      subject: 'Account Activation Email',
      html: `
      <h2> Hello ${name} </h2>
      <p>Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">Click here</a> active account</p>
      `
    }

    try {
      await emailWithNodeMailer(emailData)
    } catch (error) {
      next(createError(500, "Failed to send verification email"));
      return;
    }
    

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing registration process`,
      payload: {token}
    })
  } catch (error) {
    next(error)
  }
}

const activateUserAccount = async (req, res, next)=> {
  try {

    const token = req.body.token;
    if(!token) throw createError(404, "Token not found!");

    try {
      const decoded = jwt.verify(token, jwtSecretKey);
      if(!decoded) throw createError(401, "User wan't able to verify");

      const userExist = await User.exists({email: decoded.email});
      if(userExist) {
        throw createError(409, "User already exist with this email.")
      }
      await User.create(decoded)

      return successResponse(res, {
        statusCode: 201,
        message: `User is registered successfully!`,
      })
    } catch (error) {
      if(error.name === 'TokenExpiredError') {
        throw createError(401, "Token has expired")
      } else if (error.name === 'JsonWebTokenError') {
        throw createError(401, "Invalid Token")
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error)
  }
}

module.exports = { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserByID };