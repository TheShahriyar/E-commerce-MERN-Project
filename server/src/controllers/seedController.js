const User = require("../models/userModel")
const data = require('../data')
const seedUser = async (req, res, next) => {
  try {
    // Deleteing all existing users
    await User.deleteMany({});

    // Inserting new user
    const users = await User.insertMany(data.users)

    //Successful Response
    return res.status(201).json(users)

  } catch (error) {
    next(error)
  }
}

module.exports = {seedUser}