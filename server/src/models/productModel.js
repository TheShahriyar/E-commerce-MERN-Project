const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultUserImage } = require("../secret");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name can be minimum 3 character"],
      maxlength: [150, "Product name can be maximum 150 character"],
    },
    slug: {
      type: String,
      required: [true, "Product name is required"],
      lowercase: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) => {
          `${props.value} is not a valid price. Product price must be greater than 0!`;
        },
      },
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [3, "Product description can be minimum 3 character"],
    },
    image: {
      type: Buffer,
      required: [true, "Image is required"],
      contentType: String,
      default: defaultUserImage,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) => {
          `${props.value} is not a valid quantity. Product quantity must be greater than 0!`;
        },
      },
    },
    sold: {
      type: Number,
      required: [true, "Sold quantity is required"],
      trim: true,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
