const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },

    unit: {
      type: String,
      enum: ["kg", "quintal", "ton", "piece"],
      required: [true, "Unit is required"],
    },

    pricePerUnit: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    quality: {
      type: String,
      enum: ["A", "B", "C"],
      default: "A",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      address: {
        type: String,
        trim: true,
      },

      lat: {
        type: Number,
      },

      lng: {
        type: Number,
      },
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "sold", "inactive"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;