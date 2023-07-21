const User = require("../models/userModel");

const checkUserExist = async (email) => {
  return User.exists({ email: email });
};

module.exports = checkUserExist;
