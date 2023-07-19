const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs');
const { defaultUserImage } = require('../secret');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    minlength: [3, 'User name can be minimum 3 character'],
    maxlength: [31, 'User name can be maximum 31 character'],
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password can be minimum 6 character'],
    set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
  },
  image: {
    type: Buffer,
    required: [true, 'Image is required'],
    contentType: String,
    default: defaultUserImage
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    minlength: [3, 'Address can be minimum 3 character'],
  },
  phone: {
    type: String,
    required: [true, 'Address is required'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  }, 
}, {timestamps: true});


const User = model('Users', userSchema)

module.exports = User;